import { AuthContext } from "@/context/AuthContext";
import { useNotificationListeners } from "@/features/notifications/hooks/useNotificationListeners";
import { useNotificationSetup } from "@/features/notifications/hooks/useNotificationSetup";
import { useRegisterPushToken } from "@/features/notifications/hooks/useRegisterPushToken";
import Main from "@/shared/components/Main";
import { use } from "react";

export default function HomeTab() {
  const { session } = use(AuthContext);
  const userId = session?.user?.id;
  useNotificationSetup();
  useRegisterPushToken(userId);
  useNotificationListeners();

  return <Main />;
}
