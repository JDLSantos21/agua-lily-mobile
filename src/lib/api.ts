// src/services/api.ts
import axios, { AxiosError } from "axios";
import { authService } from "@/features/auth/services/auth.service";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

/* ---------- request: añade access token ---------- */
api.interceptors.request.use(async (config) => {
  const token = await authService.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<void> | null = null;

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
        refreshPromise = authService.refresh().finally(() => {
          refreshPromise = null; // se limpia al terminar
        });
      }

      return refreshPromise.then(async () => {
        const newToken = await authService.getAccessToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      });
    }

    console.log("API error:", error, error.response?.data);
    return Promise.reject(error);
  }
);
