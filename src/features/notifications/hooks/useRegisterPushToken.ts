import { useEffect, useState } from "react";
import { savePushToken } from "../services/pushToken.service";
import { save, get } from "@/shared/utils/secureStore";
import { configureNotificationChannel } from "../services/notificationManager.service";

export function useRegisterPushToken(userId?: string) {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    configureNotificationChannel();

    const register = async () => {
      try {
        const alreadyRegistered = await get("pushToken");

        if (alreadyRegistered) {
          setPushToken(alreadyRegistered);
          console.log("Push token already registered:", alreadyRegistered);
          return;
        }

        const token = await savePushToken(userId);
        setPushToken(token);
        save("pushToken", token);
      } catch (e) {
        setError(e as Error);
      }
    };

    register();
  }, [userId]);

  return { pushToken, error };
}
