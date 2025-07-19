import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { EventSubscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";
import { save } from "@/shared/utils/secureStore";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<EventSubscription>(null);
  const responseListener = useRef<EventSubscription>(null);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "Notification response: el usuario interactuo con la notificación",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification, null, 2)
        );
        // handle response notification here
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const registerToken = async (userId: string) => {
    try {
      const token = await registerForPushNotificationsAsync(userId);
      setExpoPushToken(token);
      save("pushToken", token);
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    expoPushToken,
    notification,
    error,
    registerToken,
  };
}
