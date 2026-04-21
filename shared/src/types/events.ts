export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

export interface PaymentProcessedEvent {
  paymentId: string;
  orderId: string;
  status: 'SUCCESS' | 'FAILED';
  processedAt: string;
  failureReason: string | null;
}

export type DeliveryStatus = 'PREPARING' | 'SHIPPED' | 'DELIVERED';
export type OrderStatus = 'PENDING' | DeliveryStatus | 'PAYMENT_FAILED';

export interface OrderStatusUpdatedEvent {
  orderId: string;
  status: DeliveryStatus;
  courier: string;
  updatedAt: string;
}

export interface OrderStatsEvent {
  windowStart: string;
  ordersCount: number;
  totalRevenue: number;
  successRate: number;
  avgProcessingMs: number;
}

export interface DLQMessage<T = unknown> {
  originalMessage: T;
  error: string;
  retryCount: number;
  failedAt: string;
  topic: string;
}
