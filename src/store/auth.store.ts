import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { save, get, del } from "@/shared/utils/secureStore";
import {
  loginApi,
  logoutApi,
  refreshApi,
} from "@/features/auth/services/auth.api";
import { getItemAsync } from "expo-secure-store";
import { deactivatePushToken } from "@/features/notifications/api/registerToken.api";

type User = {
  id: string;
  name: string;
  role: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<boolean>;
};

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      async login(username, password) {
        const { data } = await loginApi(username, password);
        console.log("Login successful");
        await save("access", data.access_token);
        await save("refresh", data.refresh_token);
        set({
          user: {
            id: data.id,
            name: data.name,
            role: data.role,
          },
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });
        console.log("User data saved in store");
      },
      async refresh() {
        const rt = get().refreshToken;
        if (!rt) throw new Error("No refresh token available");
        try {
          const { data } = await refreshApi(rt);
          await save("access", data.access_token);
          await save("refresh", data.refresh_token);
          set({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          });
        } catch (error) {
          if (error.response.status === 401) {
            await del("access");
            await del("refresh");
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
            });
          }
        }
      },
      async logout() {
        try {
          const pushToken = await getItemAsync("pushToken");
          if (pushToken) await deactivatePushToken(pushToken);
          await logoutApi(get().refreshToken);
        } catch {
          return false;
        }
        await del("access");
        await del("refresh");
        await del("pushToken");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });

        return true;
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => ({
        getItem: (k) => get(k),
        setItem: (k, v) => save(k, v),
        removeItem: (k) => del(k),
      })),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
