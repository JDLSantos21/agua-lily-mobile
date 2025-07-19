import { api } from "@/lib/api";

export const loginApi = (username: string, password: string) =>
  api.post("/auth/login", {
    username,
    password,
  });

export const logoutApi = (refresh_token: string) =>
  api.post("/auth/logout", { refresh_token });

export const refreshApi = (refreshToken: string) =>
  api.post("/auth/refresh", { refresh_token: refreshToken });
