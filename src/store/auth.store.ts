import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { save, get, del } from "@/shared/utils/secureStore";

type User = {
  id: string;
  name: string;
  role: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
};

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
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
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
