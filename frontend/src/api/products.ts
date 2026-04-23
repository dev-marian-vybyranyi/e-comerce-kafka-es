import { api } from "./client";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  emoji: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  category: string;
  emoji: string;
  inStock: boolean;
}

export const productsApi = {
  list: () => api.get("/products"),
  get: (id: string) => api.get(`/products/${id}`),
  create: (data: ProductPayload) => api.post("/products", data),
  update: (id: string, data: Partial<ProductPayload>) =>
    api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};
