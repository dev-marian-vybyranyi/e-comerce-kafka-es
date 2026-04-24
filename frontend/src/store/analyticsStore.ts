import { create } from "zustand";

interface AnalyticsPoint {
  time: string;
  orders: number;
}

interface AnalyticsState {
  history: AnalyticsPoint[];
  successRate: number;
  avgMs: number;
  totals: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderAmount: number;
  };
  addPoint: (point: AnalyticsPoint) => void;
  setStats: (successRate: number, avgMs: number) => void;
  setTotals: (totals: AnalyticsState["totals"]) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  history: [],
  successRate: 0,
  avgMs: 0,
  totals: { totalOrders: 0, totalRevenue: 0, avgOrderAmount: 0 },

  addPoint: (point) =>
    set((state) => ({
      history: [...state.history.slice(-20), point],
    })),

  setStats: (successRate, avgMs) => set({ successRate, avgMs }),

  setTotals: (totals) => set({ totals }),
}));
