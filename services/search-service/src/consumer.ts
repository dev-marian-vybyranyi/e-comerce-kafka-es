import {
  createConsumer,
  DLQMessage,
  OrderCreatedEvent,
  OrderStatusUpdatedEvent,
  PaymentProcessedEvent,
  TOPICS,
} from "@ecommerce/shared";
import { KafkaMessage } from "kafkajs";
import { upsertOrder } from "./elastic";

async function handleOrders(message: KafkaMessage): Promise<void> {
  if (!message.value) return;
  const event: OrderCreatedEvent = JSON.parse(message.value.toString());

  const fullText = [
    event.orderId,
    event.userId,
    ...event.items.map((i) => i.productId),
  ].join(" ");

  await upsertOrder(event.orderId, {
    orderId: event.orderId,
    userId: event.userId,
    items: event.items,
    totalAmount: event.totalAmount,
    status: "PENDING",
    createdAt: event.createdAt,
    updatedAt: event.createdAt,
    fullText,
  });

  console.log(`[Search] Indexed new order: ${event.orderId}`);
}

async function handlePayments(message: KafkaMessage): Promise<void> {
  if (!message.value) return;
  const event: PaymentProcessedEvent = JSON.parse(message.value.toString());

  await upsertOrder(event.orderId, {
    paymentStatus: event.status,
    processedAt: event.processedAt,
    updatedAt: event.processedAt,
  });

  console.log(
    `[Search] Updated payment status for order: ${event.orderId} → ${event.status}`,
  );
}

async function handleStatusUpdated(message: KafkaMessage): Promise<void> {
  if (!message.value) return;
  const event: OrderStatusUpdatedEvent = JSON.parse(message.value.toString());

  await upsertOrder(event.orderId, {
    status: event.status,
    courier: event.courier,
    updatedAt: event.updatedAt,
  });

  console.log(
    `[Search] Updated order status: ${event.orderId} → ${event.status}`,
  );
}

async function handleDLQ(message: KafkaMessage): Promise<void> {
  if (!message.value) return;
  const dlq: DLQMessage<OrderCreatedEvent> = JSON.parse(
    message.value.toString(),
  );

  await upsertOrder(dlq.originalMessage.orderId, {
    status: "PAYMENT_FAILED",
    paymentStatus: "FAILED",
    updatedAt: dlq.failedAt,
  });

  console.log(
    `[Search] Marked order as payment_failed: ${dlq.originalMessage.orderId}`,
  );
}

export async function startConsumers(): Promise<void> {
  await createConsumer(
    "search-service",
    [
      TOPICS.ORDERS,
      TOPICS.PAYMENTS,
      TOPICS.ORDER_STATUS_UPDATED,
      TOPICS.ORDERS_DLQ,
    ],
    async (topic: string, message: KafkaMessage) => {
      switch (topic) {
        case TOPICS.ORDERS:
          await handleOrders(message);
          break;
        case TOPICS.PAYMENTS:
          await handlePayments(message);
          break;
        case TOPICS.ORDER_STATUS_UPDATED:
          await handleStatusUpdated(message);
          break;
        case TOPICS.ORDERS_DLQ:
          await handleDLQ(message);
          break;
      }
    },
  );

  console.log("[Search] Consumers started for all 4 topics");
}
