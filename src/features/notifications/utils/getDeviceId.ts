import { Platform } from "react-native";

export function getDeviceId(): string {
  const platform = Platform.OS;
  const timestamp = Math.floor(Date.now() / 1000);
  const randomString = Math.random().toString(36).substring(2, 11);
  return `${platform}-${timestamp}-${randomString}`;
}
