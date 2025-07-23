import { useNotificationListeners } from "@/features/notifications/hooks/useNotificationListeners";
import { useNotificationSetup } from "@/features/notifications/hooks/useNotificationSetup";
import { useRegisterPushToken } from "@/features/notifications/hooks/useRegisterPushToken";
import Main from "@/shared/components/Main";
import { authStore } from "@/store/auth.store";

export default function HomeTab() {
  const userId = authStore.getState().user?.id;
  useNotificationSetup();
  useRegisterPushToken(userId);
  useNotificationListeners();

  return <Main />;
}
