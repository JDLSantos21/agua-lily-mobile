import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { save, get, del } from "@/shared/utils/secureStore";
import { loginApi, logoutApi, refreshApi } from "@/services/auth.service";

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
  logout: () => Promise<void>;
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
        await save("access", data.token);
        await save("refresh", data.refresh_token);
        set({
          user: {
            id: data.id,
            name: data.name,
            role: data.role,
          },
          accessToken: data.token,
          refreshToken: data.refresh_token,
        });

        console.log("User data saved in store:", data);
      },
      async refresh() {
        const rt = get().refreshToken;
        if (!rt) throw new Error("No refresh token available");
        const { data } = await refreshApi(rt);
        await save("access", data.token);
        set({
          accessToken: data.token,
        });
      },
      async logout() {
        await logoutApi();
        await del("access");
        await del("refresh");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
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
