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

export interface ProductSearchParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export const productsApi = {
  list: (params?: ProductSearchParams) => api.get("/products", { params }),
  categories: () => api.get("/products/categories"),
  get: (id: string) => api.get(`/products/${id}`),
  create: (data: ProductPayload) => api.post("/products", data),
  update: (id: string, data: Partial<ProductPayload>) =>
    api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};
