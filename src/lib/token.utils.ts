import axios from "axios";

export default function refreshToken(refresh_token: string) {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  return axios.post(`${baseURL}/auth/refresh`, { refresh_token });
}
