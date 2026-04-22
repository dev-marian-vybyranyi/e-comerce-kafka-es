import axios from "axios";
import type { Order, OrderItem } from "./types";

const ORDER_API = import.meta.env.VITE_ORDER_API_URL;

export interface CreateOrderPayload {
  userId: string;
  items: OrderItem[];
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const res = await axios.post(`${ORDER_API}/orders`, payload);
  return res.data as { orderId: string; status: string; totalAmount: number };
};

export const getOrders = async (limit = 20, offset = 0) => {
  const res = await axios.get(`${ORDER_API}/orders`, {
    params: { limit, offset },
  });
  return res.data as { orders: Order[]; total: number };
};
