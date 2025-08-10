import { authStore } from "@/store/auth.store";
import { loginApi, logoutApi, refreshApi } from "./auth.api";
import { save, get, del } from "@/shared/utils/secureStore";
import { deactivatePushToken } from "@/features/notifications/api/registerToken.api";

class AuthService {
  async login(username: string, password: string) {
    try {
      const { data } = await loginApi(username, password);

      await save("access", data.access_token);
      await save("refresh", data.refresh_token);

      authStore.getState().setUser({
        id: data.id,
        name: data.name,
        role: data.role,
      });

      console.log("login success: ", data);
    } catch (error) {
      console.log("Login failed: ", error);
      throw error;
    }
  }

  async refresh() {
    try {
      const refreshToken = await get("refresh");
      if (!refreshToken) {
        console.warn("No refresh token available, cannot refresh session.");
        throw new Error("No refresh token available");
      }

      const { data } = await refreshApi(refreshToken);

      await save("access", data.access_token);
      await save("refresh", data.refresh_token);
    } catch (error) {
      if (error?.response?.status === 401) {
        await this.clearSession();
      }
      throw error;
    }
  }

  async logout() {
    try {
      const refreshToken = await get("refresh");
      const pushToken = await get("pushToken");

      if (pushToken) {
        await deactivatePushToken(pushToken);
      }

      if (refreshToken) {
        await logoutApi(refreshToken);
      }

      await this.clearSession();

      return true;
    } catch (error) {
      console.log("Logout failed: ", error);
      await this.clearSession();
      return false;
    }
  }

  async clearSession() {
    await del("access");
    await del("refresh");
    await del("pushToken");

    authStore.getState().clearAuth();
  }

  async getAccessToken() {
    return await get("access");
  }

  async getRefreshToken() {
    return await get("refresh");
  }

  async initializeAuth() {
    try {
      const accessToken = await this.getAccessToken();
      const refreshToken = await this.getRefreshToken();

      if (accessToken && refreshToken) {
        try {
          await this.refresh();
        } catch (error) {
          console.log("Failed to refresh token, clearing session: ", error);
          await this.clearSession();
        }
      }
    } catch (error) {
      console.log("Error initializing auth: ", error);
      await this.clearSession();
    }
  }
}

export const authService = new AuthService();
