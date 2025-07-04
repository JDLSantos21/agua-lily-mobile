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

/* ---------- response: refresh automático ---------- */
let refreshing = false;
let queue: ((t: string | null) => void)[] = [];

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError<any>) => {
    const original = error.config as any;
    const data = error.response?.data;
    const status = error.response?.status;

    if (
      status === 401 &&
      data?.message === "TOKEN_EXPIRED" &&
      !original._retry
    ) {
      original._retry = true;

      // evita varios refresh a la vez
      if (!refreshing) {
        refreshing = true;
        try {
          await authStore.getState().refresh(); // POST /auth/refresh
          queue.forEach((cb) => cb(authStore.getState().accessToken as string));
          queue = [];
        } catch (e) {
          queue.forEach((cb) => cb(null)); // notifica fallo
          authStore.getState().logout();
          return Promise.reject(e);
        } finally {
          refreshing = false;
        }
      }

      // espera a que termine la primera llamada refresh
      return new Promise((resolve, reject) => {
        queue.push((newToken) => {
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          } else {
            reject(error);
          }
        });
      });
    }

    return Promise.reject(error);
  }
);
