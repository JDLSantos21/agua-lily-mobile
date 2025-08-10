import { authStore } from "@/store/auth.store";
import { useEffect } from "react";
import { authService } from "../services/auth.service";
import { router } from "expo-router";

export function useAuth() {
  const { user, isAuthenticated } = authStore();

  useEffect(() => {
    authService.initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    await authService.login(username, password);
    router.replace("/");
  };

  const logout = async () => await authService.logout();

  const refresh = async () => {
    await authService.refresh();
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    refresh,
  };
}
