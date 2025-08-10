// shared/components/AuthGuard.tsx
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "expo-router";
import Loading from "./Loading";
import { authService } from "@/features/auth/services/auth.service";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await authService.initializeAuth();
      setChecking(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!checking && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, checking, router]);

  if (checking)
    return (
      <Loading
        title="Verificando sesión"
        message="Esto solo tomará un momento..."
        color="#3B82F6"
        size="large"
      />
    );

  return <>{children}</>;
}
