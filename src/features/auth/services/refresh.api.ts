import axios from "axios";

export const rawApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export const refreshApi = (refreshToken: string) =>
  rawApi.post("/auth/refresh", { refresh_token: refreshToken });

export const loginApi = (username: string, password: string) =>
  rawApi.post("/auth/login", {
    username,
    password,
  });

export const logoutApi = (refresh_token: string) =>
  rawApi.post("/auth/logout", { refresh_token });
