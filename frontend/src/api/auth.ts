import { api } from "./client";

export const authApi = {
  register: (data: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  me: () => api.get("/auth/me"),

  logout: (refreshToken: string) => api.post("/auth/logout", { refreshToken }),
};
