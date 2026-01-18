import { useEffect, useState } from "react";
import { savePushToken } from "../services/pushToken.service";
import { save, get } from "@/shared/utils/secureStore";
import { configureNotificationChannel } from "../services/notificationManager.service";
import { useAlert } from "@/shared/components/ui/Alert";

export function useRegisterPushToken(userId?: string) {
  const alert = useAlert();
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

        if (!token) {
          alert.show(
            "Permiso de notificaciones no concedido",
            "No podrás recibir notificaciones. Por favor, activa los permisos en la configuración de tu dispositivo.",
          );
          return;
        }

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
