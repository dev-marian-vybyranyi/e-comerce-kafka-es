import axios from "axios";

const ANALYTICS_API = import.meta.env.VITE_ANALYTICS_API_URL;

export const getAnalyticsStats = async () => {
  const res = await axios.get(`${ANALYTICS_API}/stats`);
  return res.data as {
    windowStart: string;
    ordersCount: number;
    totalRevenue: number;
    successRate: number;
    avgProcessingMs: number;
  };
};
