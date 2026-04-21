import {
  createConsumer,
  OrderCreatedEvent,
  PaymentProcessedEvent,
  TOPICS,
} from "@ecommerce/shared";
import { KafkaMessage } from "kafkajs";
import {
  orderProcessingDuration,
  paymentFailureTotal,
  paymentSuccessTotal,
} from "./metrics";
import { windowManager } from "./window";

export async function startConsumer(): Promise<void> {
  await createConsumer(
    "analytics-service",
    [TOPICS.ORDERS, TOPICS.PAYMENTS],
    async (topic: string, message: KafkaMessage) => {
      if (!message.value) return;

      if (topic === TOPICS.ORDERS) {
        const event: OrderCreatedEvent = JSON.parse(message.value.toString());
        windowManager.recordOrder(
          event.orderId,
          event.totalAmount,
          event.createdAt,
        );
        console.log(
          `[Analytics] Order recorded: ${event.orderId}, amount: ${event.totalAmount}`,
        );
      }

      if (topic === TOPICS.PAYMENTS) {
        const event: PaymentProcessedEvent = JSON.parse(
          message.value.toString(),
        );
        windowManager.recordPayment(
          event.orderId,
          event.status,
          event.processedAt,
        );

        if (event.status === "SUCCESS") {
          paymentSuccessTotal.inc();
        } else {
          paymentFailureTotal.inc();
        }

        const stats = windowManager.getCurrentStats();
        if (stats.avgProcessingMs > 0) {
          orderProcessingDuration.observe(stats.avgProcessingMs / 1000);
        }

        console.log(
          `[Analytics] Payment recorded: ${event.orderId} → ${event.status}`,
        );
      }
    },
  );

  console.log("[Analytics] Consumer started");
}
