import { useEffect, useState, useCallback } from "react";
import { savePushToken } from "../services/pushToken.service";
import { save, get } from "@/shared/utils/secureStore";
import { configureNotificationChannel } from "../services/notificationManager.service";
import { useAlert } from "@/shared/components/ui/Alert";

export function useRegisterPushToken(userId?: string) {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const alert = useAlert();

  // Estabilizamos la función de error con useCallback
  const handleError = useCallback(
    (e: Error) => {
      alert.error(
        "Ocurrió un error",
        e.message || "No se pudo registrar el token de notificación."
      );
      setError(e);
    },
    [alert]
  );

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
        handleError(e as Error);
      }
    };

    register();
  }, [userId, handleError]); // Ahora usamos handleError que está estabilizado

  return { pushToken, error };
}
