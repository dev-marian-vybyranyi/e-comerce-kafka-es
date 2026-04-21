import { v4 as uuidv4 } from "uuid";
import {
  Producer,
  publishMessage,
  publishToDLQ,
  withRetry,
  OrderCreatedEvent,
  PaymentProcessedEvent,
  TOPICS,
} from "@ecommerce/shared";

const FAILURE_RATE = 0.2;

function simulatePayment(): boolean {
  return Math.random() > FAILURE_RATE;
}

function simulateDelay(): Promise<void> {
  const ms = 1000 + Math.random() * 2000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processPayment(
  producer: Producer,
  order: OrderCreatedEvent,
): Promise<void> {
  console.log(`[Payment] Processing order ${order.orderId}...`);

  await simulateDelay();

  try {
    await withRetry(
      async () => {
        const success = simulatePayment();

        const event: PaymentProcessedEvent = {
          paymentId: uuidv4(),
          orderId: order.orderId,
          status: success ? "SUCCESS" : "FAILED",
          processedAt: new Date().toISOString(),
          failureReason: success ? null : "Insufficient funds",
        };

        if (!success) {
          throw new Error(event.failureReason!);
        }

        await publishMessage(producer, TOPICS.PAYMENTS, event, order.orderId);
        console.log(`[Payment] SUCCESS for order ${order.orderId}`);
      },
      3,
      `payment-${order.orderId}`,
    );
  } catch (err) {
    const failedEvent: PaymentProcessedEvent = {
      paymentId: uuidv4(),
      orderId: order.orderId,
      status: "FAILED",
      processedAt: new Date().toISOString(),
      failureReason: err instanceof Error ? err.message : "Unknown error",
    };

    await publishMessage(producer, TOPICS.PAYMENTS, failedEvent, order.orderId);
    await publishToDLQ(
      producer,
      TOPICS.ORDERS,
      order,
      failedEvent.failureReason!,
      3,
    );
    console.log(`[Payment] FAILED for order ${order.orderId} => sent to DLQ`);
  }
}
