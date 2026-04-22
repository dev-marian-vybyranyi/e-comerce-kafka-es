import { api } from "./client";

export const ordersApi = {
  create: (data: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
  }) => api.post("/orders", data),

  list: (limit = 20, offset = 0) =>
    api.get("/orders", { params: { limit, offset } }),
};
