// shared/components/AuthGuard.tsx
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "expo-router";
import Loading from "./Loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
    setChecking(false);
  }, [accessToken, router]);

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
