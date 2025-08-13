import { authService } from "@/features/auth/services/auth.service";
import { useStorageState } from "@/hooks/useStorageState";
import { save } from "@/shared/utils/secureStore";
import axios, { AxiosError } from "axios";
import {
  use,
  createContext,
  type PropsWithChildren,
  useEffect,
  useCallback,
  useState,
} from "react";

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

export const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<any> | void;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
  isSigningIn: boolean;
}>({
  signIn: () => {},
  signOut: () => {},
  session: null,
  isLoading: false,
  isSigningIn: false,
});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [[isLoading, sessionString], setSessionString] =
    useStorageState("session");

  // Parse the session string into Session object with error handling
  const session: Session | null = sessionString
    ? (() => {
        try {
          return JSON.parse(sessionString);
        } catch (error) {
          console.error("Error parsing session:", error);
          return null;
        }
      })()
    : null;

  const signOut = useCallback(() => {
    setSessionString(null);
  }, [setSessionString]);

  useEffect(() => {
    authService.setSignOutCallback(signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (username: string, password: string) => {
          setIsSigningIn(true);
          const baseURL = process.env.EXPO_PUBLIC_API_URL;

          try {
            const response = await axios.post(`${baseURL}/auth/login`, {
              username,
              password,
            });

            const sessionData: Session = {
              access_token: response.data.access_token,
              user: {
                id: response.data.id.toString(),
                role: response.data.role,
                name: response.data.name,
              },
              refresh_token: response.data.refresh_token,
            };

            await save("refresh_token", response.data.refresh_token);
            console.log("Se guardo el refresh");
            setSessionString(JSON.stringify(sessionData));
          } catch (error) {
            throw error as AxiosError;
          } finally {
            setIsSigningIn(false);
          }
        },
        signOut,
        session,
        isSigningIn,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
