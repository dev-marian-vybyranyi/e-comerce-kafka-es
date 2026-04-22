import { api } from "./client";

export const analyticsApi = {
  stats: () => api.get("/analytics"),
};
