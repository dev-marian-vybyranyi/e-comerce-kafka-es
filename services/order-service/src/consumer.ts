import {
  createConsumer,
  OrderStatusUpdatedEvent,
  TOPICS,
} from "@ecommerce/shared";
import { KafkaMessage } from "kafkajs";
import { updateOrderStatus } from "./database";
import { sseManager } from "./sse";

export async function startConsumer(): Promise<void> {
  await createConsumer(
    "order-service",
    [TOPICS.ORDER_STATUS_UPDATED],
    async (topic: string, message: KafkaMessage) => {
      if (!message.value) return;

      const event: OrderStatusUpdatedEvent = JSON.parse(
        message.value.toString(),
      );
      console.log(
        `[Consumer] Order status updated: ${event.orderId} → ${event.status}`,
      );

      updateOrderStatus(event.orderId, event.status, event.courier);

      sseManager.broadcast("order.status.updated", {
        orderId: event.orderId,
        status: event.status,
        courier: event.courier,
        updatedAt: event.updatedAt,
      });
    },
  );
}
