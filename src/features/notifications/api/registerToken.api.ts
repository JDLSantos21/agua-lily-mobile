import { api } from "@/lib/api";

interface PushTokenData {
  token: string;
  userId: string;
  deviceId: string;
  platform: "ios" | "android";
}

export interface PushTokenRecord {
  id: number;
  userId: string;
  token: string;
  deviceId: string;
  platform: "ios" | "android";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PushTokenResponse {
  success: boolean;
  message: string;
  data: PushTokenRecord;
}

export async function registerPushToken(
  data: PushTokenData
): Promise<PushTokenResponse> {
  const res = await api.post("/notifications/register-token", data);
  return res.data;
}

export async function deactivatePushToken(
  token: string
): Promise<Partial<PushTokenResponse>> {
  const res = await api.post("/notifications/desactivate-token", { token });
  return res.data;
}
