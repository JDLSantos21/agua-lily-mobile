import { del, save, get } from "@/shared/utils/secureStore";
import axios from "axios";

interface User {
  id: string;
  role: string;
  name: string;
}

interface Session {
  access_token: string;
  user: User | null;
  refresh_token: string | null;
}

class AuthService {
  private signOutCallback: (() => void) | null = null;

  setSignOutCallback(callback: () => void) {
    this.signOutCallback = callback;
  }
  async clearSession() {
    await del("session");
    await del("refresh_token");

    if (this.signOutCallback) {
      this.signOutCallback();
    }
  }

  async signOut(refreshToken: string | null) {
    if (refreshToken) {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {
        refresh_token: refreshToken,
      });
    }
  }

  async saveTokens(accessToken: string, refreshToken: string) {
    // Get current session to preserve user data
    const currentSessionString = await get("session");
    if (currentSessionString) {
      const currentSession: Session = JSON.parse(currentSessionString);
      const updatedSession: Session = {
        ...currentSession,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
      await save("session", JSON.stringify(updatedSession));
    }
    await save("refresh_token", refreshToken);
  }
}

export const authService = new AuthService();
