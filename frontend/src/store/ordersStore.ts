import { create } from "zustand";

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "PAYMENT_FAILED";

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
  status: OrderStatus;
  courier: string | null;
  createdAt: string;
  updatedAt: string;
  paymentStatus?: string;
}

interface OrdersState {
  orders: Order[];
  total: number;
  isLoading: boolean;
  setOrders: (orders: Order[], total: number) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    courier?: string,
    updatedAt?: string,
  ) => void;
  setLoading: (loading: boolean) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  total: 0,
  isLoading: false,

  setOrders: (orders, total) => set({ orders, total }),

  updateOrderStatus: (orderId, status, courier, updatedAt) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              status,
              courier: courier ?? o.courier,
              updatedAt: updatedAt ?? o.updatedAt,
            }
          : o,
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));
