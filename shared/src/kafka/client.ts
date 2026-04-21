import { Kafka, Producer, Consumer, KafkaMessage, logLevel } from "kafkajs";
import {
  kafkaMessagesProduced,
  kafkaMessagesConsumed,
  kafkaConsumerLag,
} from "./metrics";
import { TOPICS } from "../types/topics";
import { DLQMessage } from "../types/events";

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "ecommerce",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  logLevel: logLevel.WARN,
});

// Producer

export async function createProducer(clientId: string): Promise<Producer> {
  const producer = kafka.producer({
    retry: {
      initialRetryTime: 300,
      retries: 3,
    },
  });

  await producer.connect();
  console.log(`[${clientId}] Producer connected`);
  return producer;
}

export async function publishMessage<T>(
  producer: Producer,
  topic: string,
  message: T,
  key?: string,
): Promise<void> {
  await producer.send({
    topic,
    messages: [
      {
        key: key || null,
        value: JSON.stringify(message),
        timestamp: Date.now().toString(),
      },
    ],
  });

  kafkaMessagesProduced.inc({ topic });
}

export async function publishToDLQ<T>(
  producer: Producer,
  originalTopic: string,
  originalMessage: T,
  error: string,
  retryCount: number,
): Promise<void> {
  const dlqMessage: DLQMessage<T> = {
    originalMessage,
    error,
    retryCount,
    failedAt: new Date().toISOString(),
    topic: originalTopic,
  };

  await publishMessage(producer, TOPICS.ORDERS_DLQ, dlqMessage);
  console.log(
    `[DLQ] Message from ${originalTopic} sent to DLQ after ${retryCount} retries`,
  );
}

// Consumer

export async function createConsumer(
  groupId: string,
  topics: string[],
  handler: (topic: string, message: KafkaMessage) => Promise<void>,
): Promise<Consumer> {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        await handler(topic, message);
        kafkaMessagesConsumed.inc({ topic, groupId });
      } catch (err) {
        kafkaConsumerLag.inc({ topic, groupId });
        console.error(
          `[${groupId}] Error processing message from ${topic}:`,
          err,
        );
      }
    },
  });

  console.log(
    `[${groupId}] Consumer connected, listening to: ${topics.join(", ")}`,
  );
  return consumer;
}

// Retry wrapper

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  label = "operation",
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = Math.pow(2, attempt) * 500; // 1s, 2s, 4s
      console.warn(
        `[retry] ${label} failed (attempt ${attempt}/${retries}), retrying in ${delay}ms`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error(`${label} failed after ${retries} retries`);
}

// Graceful shutdown

export function setupGracefulShutdown(
  connections: Array<Producer | Consumer>,
  label: string,
): void {
  const shutdown = async (signal: string) => {
    console.log(`[${label}] Received ${signal}, shutting down gracefully...`);
    for (const conn of connections) {
      await conn.disconnect();
    }
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
