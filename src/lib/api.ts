// src/services/api.ts
import axios, { AxiosError } from "axios";
import { get, save } from "@/shared/utils/secureStore";
import refreshToken from "./token.utils";
import { authService } from "@/features/auth/services/auth.service";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

/* ---------- request: añade access token ---------- */
api.interceptors.request.use(async (config) => {
  const sessionString = await get("session");
  if (sessionString) {
    const session = JSON.parse(sessionString);
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
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
        const refresh_token = await get("refresh_token");
        refreshPromise = refreshToken(refresh_token)
          .then((data) => {
            console.log("Token refreshed");

            // Get current session and update tokens
            const updateSession = async () => {
              const currentSessionString = await get("session");
              if (currentSessionString) {
                const currentSession = JSON.parse(currentSessionString);
                const updatedSession = {
                  ...currentSession,
                  access_token: data.data.access_token,
                  refresh_token: data.data.refresh_token,
                };
                await save("session", JSON.stringify(updatedSession));
              }
            };

            updateSession();
            save("refresh_token", data.data.refresh_token);
          })
          .catch(async (error: AxiosError) => {
            if (error.status === 401) {
              await authService.clearSession();
            }
            if (__DEV__) {
              console.log("No se pudo refrescar el token:", error);
            }
          })
          .finally(() => {
            refreshPromise = null; // se limpia al terminar
          });
      }

      return refreshPromise.then(async () => {
        const sessionString = await get("session");
        if (sessionString) {
          const session = JSON.parse(sessionString);
          original.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return api(original);
      });
    }

    if (__DEV__) {
      console.log("Ocurrió un error con la API:", error, error.response?.data);
    }
    return Promise.reject(error);
  }
);
