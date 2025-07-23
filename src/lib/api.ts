// src/services/api.ts
import axios, { AxiosError } from "axios";
import { authStore } from "@/store/auth.store";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

/* ---------- request: añade access token ---------- */
api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    const original = error.config as any;
    if (
      error.response?.status === 401 &&
      typeof error.response?.data === "object" &&
      error.response?.data !== null &&
      (error.response.data as { message?: string }).message ===
        "TOKEN_EXPIRED" &&
      !original._retry
    ) {
      original._retry = true;

      // si ya hay un refresh en curso reutilízalo
      if (!refreshPromise) {
        refreshPromise = authStore
          .getState()
          .refresh() // POST /auth/refresh
          .then(() => authStore.getState().accessToken as string)
          .finally(() => {
            refreshPromise = null; // se limpia al terminar
          });
      }

      // esperamos al refresh (sea propio o ajeno) y repetimos el request
      return refreshPromise.then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      });
    }

    console.log("API error:", error, error.response?.data);

    return Promise.reject(error);
  }
);
