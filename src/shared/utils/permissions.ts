// src/shared/utils/permissions.ts

import * as Notifications from "expo-notifications";

/**
 * Solicita permisos de notificaciones push.
 * Devuelve el estado final del permiso: "granted" | "denied" | "undetermined"
 */
export async function requestNotificationPermissions(): Promise<NotificationPermissionsStatus> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") return "granted";

  const { status: finalStatus } = await Notifications.requestPermissionsAsync();
  return finalStatus;
}

/**
 * Consulta el estado actual del permiso (sin pedirlo).
 */
export async function getNotificationPermissionsStatus(): Promise<NotificationPermissionsStatus> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

type NotificationPermissionsStatus = "granted" | "denied" | "undetermined";
