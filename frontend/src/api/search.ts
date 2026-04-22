import axios from "axios";
import type { Order } from "./types";

const SEARCH_API = import.meta.env.VITE_SEARCH_API_URL;

export const searchOrders = async (params: {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axios.get(`${SEARCH_API}/search`, { params });
  return res.data as { results: Order[]; total: number; page: number };
};

export const getSearchStats = async (userId?: string) => {
  const res = await axios.get(`${SEARCH_API}/search/stats`, {
    params: userId ? { userId } : {},
  });
  return res.data as {
    totalOrders: number;
    totalRevenue: number;
    avgOrderAmount: number;
    byStatus: { key: string; doc_count: number }[];
  };
};
