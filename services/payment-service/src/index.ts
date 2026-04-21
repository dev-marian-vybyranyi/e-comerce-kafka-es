import express from "express";
import cors from "cors";
import { KafkaMessage } from "kafkajs";
import {
  createProducer,
  createConsumer,
  setupGracefulShutdown,
  OrderCreatedEvent,
  TOPICS,
  register,
  httpRequestsTotal,
} from "@ecommerce/shared";
import { processPayment } from "./processor";

const PORT = parseInt(process.env.PAYMENT_SERVICE_PORT || "3002");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "payment-service",
    uptime: process.uptime(),
  });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

async function main(): Promise<void> {
  try {
    const producer = await createProducer("payment-service");

    await createConsumer(
      "payment-service",
      [TOPICS.ORDERS],
      async (_topic: string, message: KafkaMessage) => {
        if (!message.value) return;

        const order: OrderCreatedEvent = JSON.parse(message.value.toString());
        httpRequestsTotal.inc({
          method: "KAFKA",
          route: TOPICS.ORDERS,
          status: "received",
        });

        await processPayment(producer, order);
      },
    );

    app.listen(PORT, () => {
      console.log(`[payment-service] Running on http://localhost:${PORT}`);
    });

    setupGracefulShutdown([producer], "payment-service");
  } catch (err) {
    console.error("[payment-service] Failed to start:", err);
    process.exit(1);
  }
}

main();
