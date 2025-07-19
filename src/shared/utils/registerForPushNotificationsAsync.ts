import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { get } from "./secureStore";
import { registerPushToken } from "@/features/notifications/api/registerToken.api";

function generateDeviceId(): string {
  const platform = Platform.OS;
  const timestamp = Math.floor(Date.now() / 1000);
  const randomString = Math.random().toString(36).substring(2, 11);
  return `${platform}-${timestamp}-${randomString}`;
}

export async function registerForPushNotificationsAsync(userId: string) {
  const alreadyRegistered = await get("pushToken");

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert(
        "Permiso de notificaciones no concedido, no podrás recibir notificaciones. Por favor, activa los permisos en la configuración de tu dispositivo."
      );
      return;
    }

    if (alreadyRegistered) {
      console.log(
        "Ya se registró el token de notificación:",
        alreadyRegistered
      );
      return alreadyRegistered;
    }

    // const projectId =
    //   Constants.expoConfig.extra.projectId ?? Constants.easConfig.projectId;

    // if (!projectId) {
    //   alert(
    //     "No se pudo obtener el ID del proyecto de Expo. Asegúrate de que tu configuración de Expo esté correcta."
    //   );
    //   return;
    // }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        throw new Error("Project ID not found");
      }

      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      const pushTokenData = {
        token: pushTokenString,
        userId,
        deviceId: generateDeviceId(),
        platform:
          Platform.OS === "ios" ? ("ios" as const) : ("android" as const),
      };

      registerPushToken(pushTokenData);
      return pushTokenString;
    } catch (error) {
      console.error("Error obteniendo el token de notificación:", error);
      alert(
        "Error al obtener el token de notificación. Por favor, intenta nuevamente más tarde."
      );
      throw new Error("Error obteniendo el token de notificación");
    }
  }
}
