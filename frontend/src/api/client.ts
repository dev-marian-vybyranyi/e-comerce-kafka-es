import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { refreshToken, setTokens, logout } = useAuthStore.getState();
      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }
      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        setTokens(res.data.accessToken, res.data.refreshToken);
        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(original);
      } catch {
        logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
