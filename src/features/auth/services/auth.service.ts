import { del, save, get } from "@/shared/utils/secureStore";

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
  private signOutCallback: () => void | null = null;

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
