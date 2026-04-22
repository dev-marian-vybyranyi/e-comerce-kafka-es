export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "PREPARING" | "SHIPPED" | "DELIVERED" | "PAYMENT_FAILED";
  courier: string | null;
  createdAt: string;
  updatedAt: string;
}
