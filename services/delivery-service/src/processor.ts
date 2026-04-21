import {
  OrderStatusUpdatedEvent,
  PaymentProcessedEvent,
  publishMessage,
  TOPICS,
} from "@ecommerce/shared";
import { Producer } from "kafkajs";

const COURIERS = ["Іван", "Марія", "Олег", "Аня", "Тарас", "Оля"];
const STAGE_DELAY_MS = 5000;

function randomCourier(): string {
  return COURIERS[Math.floor(Math.random() * COURIERS.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processDelivery(
  producer: Producer,
  payment: PaymentProcessedEvent,
): Promise<void> {
  if (payment.status === "FAILED") {
    console.log(
      `[Delivery] Skipping failed payment for order ${payment.orderId}`,
    );
    return;
  }

  const courier = randomCourier();
  console.log(
    `[Delivery] Starting delivery for order ${payment.orderId}, courier: ${courier}`,
  );

  const stages: OrderStatusUpdatedEvent["status"][] = [
    "PREPARING",
    "SHIPPED",
    "DELIVERED",
  ];

  for (const status of stages) {
    await delay(STAGE_DELAY_MS);

    const event: OrderStatusUpdatedEvent = {
      orderId: payment.orderId,
      status,
      courier,
      updatedAt: new Date().toISOString(),
    };

    await publishMessage(
      producer,
      TOPICS.ORDER_STATUS_UPDATED,
      event,
      payment.orderId,
    );
    console.log(
      `[Delivery] Order ${payment.orderId} => ${status} (courier: ${courier})`,
    );
  }

  console.log(`[Delivery] Order ${payment.orderId} delivered by ${courier}`);
}
