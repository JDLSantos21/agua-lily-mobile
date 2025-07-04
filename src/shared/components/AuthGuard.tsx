// shared/components/AuthGuard.tsx
import { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRouter } from "expo-router";

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
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" />
      </View>
    );

  return <>{children}</>;
}
