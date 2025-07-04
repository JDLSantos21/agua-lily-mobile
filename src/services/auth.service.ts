import { api } from "./api";

export const loginApi = (username: string, password: string) =>
  api.post("/auth/login", {
    username,
    password,
  });

export const logoutApi = () => api.post("/auth/logout");

export const refreshApi = (refreshToken: string) =>
  api.post("/auth/refresh", { refresh_token: refreshToken });
