import {
  PaymentProcessedEvent,
  TOPICS,
  createConsumer,
  createProducer,
  register,
  setupGracefulShutdown,
} from "@ecommerce/shared";
import cors from "cors";
import express from "express";
import { KafkaMessage } from "kafkajs";
import { processDelivery } from "./processor";

const PORT = parseInt(process.env.DELIVERY_SERVICE_PORT || "3003");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "delivery-service",
    uptime: process.uptime(),
  });
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

async function main(): Promise<void> {
  try {
    const producer = await createProducer("delivery-service");

    await createConsumer(
      "delivery-service",
      [TOPICS.PAYMENTS],
      async (_topic: string, message: KafkaMessage) => {
        if (!message.value) return;

        const payment: PaymentProcessedEvent = JSON.parse(
          message.value.toString(),
        );

        processDelivery(producer, payment).catch((err) => {
          console.error(
            `[Delivery] Error processing order ${payment.orderId}:`,
            err,
          );
        });
      },
    );

    app.listen(PORT, () => {
      console.log(`[delivery-service] Running on http://localhost:${PORT}`);
    });

    setupGracefulShutdown([producer], "delivery-service");
  } catch (err) {
    console.error("[delivery-service] Failed to start:", err);
    process.exit(1);
  }
}

main();
