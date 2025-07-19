import { api } from "@/lib/api";

interface PushTokenData {
  token: string;
  userId: string;
  deviceId: string;
  platform: "ios" | "android";
}

export async function registerPushToken(data: PushTokenData) {
  const res = await api.post("/notifications/register-token", data);
  return res.data;
}

export async function deactivatePushToken(token: string) {
  const res = await api.post("/notifications/desactivate-token", { token });
  return res.data;
}
