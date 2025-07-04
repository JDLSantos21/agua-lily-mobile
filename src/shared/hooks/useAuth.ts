import { authStore } from "@/store/auth.store";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export function useAuth() {
  const { user, accessToken, login, logout, refresh } = authStore();

  const router = useRouter();

  const signIn = useCallback(
    async (username: string, password: string) => {
      await login(username, password);
      router.push("/");
    },
    [login, router]
  );

  const signOut = useCallback(async () => {
    router.push("/login");
    await logout();
  }, [logout, router]);

  return {
    user,
    accessToken,
    signIn,
    signOut,
    refresh,
  };
}
