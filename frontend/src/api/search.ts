import { api } from "./client";

export const searchApi = {
  search: (params: {
    q?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get("/search", { params }),

  stats: () => api.get("/search/stats"),
};
