import { useNotificationListeners } from "@/features/notifications/hooks/useNotificationListeners";
import { useRegisterPushToken } from "@/features/notifications/hooks/useRegisterPushToken";
import Main from "@/shared/components/Main";
import { authStore } from "@/store/auth.store";

export default function HomeTab() {
  const userId = authStore.getState().user?.id;
  useRegisterPushToken(userId);
  useNotificationListeners();

  return (
    <>
      <Main />
    </>
  );
}
