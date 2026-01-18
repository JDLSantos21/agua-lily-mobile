import { getDeviceId } from "../utils/getDeviceId";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import {
  registerPushToken,
  deactivatePushToken,
} from "../api/registerToken.api";
import { requestNotificationPermissions } from "@/shared/utils/permissions";

export async function savePushToken(userId: string) {
  if (!Device.isDevice) return;

  const status = await requestNotificationPermissions();

  if (status !== "granted") {
    console.warn("Permisos de notificaciones no concedidos");
    return null;
  }

  const projectId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.expoConfig?.extra?.projectId;
  if (!projectId) throw new Error("Expo project ID is missing");

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  console.log(projectId, token);

  await registerPushToken({
    token,
    userId,
    deviceId: getDeviceId(),
    platform: Platform.OS === "ios" ? "ios" : "android",
  });

  return token;
}

export { deactivatePushToken };
