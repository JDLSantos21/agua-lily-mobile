// push token service, save the push token to the database and more

import { api } from "@/lib/api";

interface PushTokenData {
  token: string;
  userId: string;
  deviceId: string;
  platform: "android" | "ios";
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

export class PushTokenService {
  static async savePushToken(data: PushTokenData): Promise<PushTokenResponse> {
    const res = await api.post("/notifications/register-token", data);
    return res.data;
  }

  static async desactivatePushToken(
    token: string
  ): Promise<Partial<PushTokenResponse>> {
    const res = await api.post("/notifications/desactivate-token", { token });
    return res.data;
  }
}
