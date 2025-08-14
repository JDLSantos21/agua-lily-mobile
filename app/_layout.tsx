// app/_layout.tsx
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertProvider, AlertComponent } from "@/shared/components/ui/Alert";
import { SessionProvider, useSession } from "@/context/AuthContext";
import Loading from "@/shared/components/Loading";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, isLoading } = useSession();

  // Si aún está cargando la sesión, muestra loading
  if (isLoading) {
    return <Loading size="large" variant="fullscreen" />;
  }

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(protected)/(tabs)" />
        <Stack.Screen name="(protected)/profile" />
        <Stack.Screen
          name="(protected)/[tracking_code]"
          options={{ headerBackTitle: "Atrás" }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const { isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <GestureHandlerRootView style={{ flex: 1, paddingBottom: insets.bottom }}>
      <StatusBar style="dark" />
      <BottomSheetModalProvider>
        <KeyboardProvider>
          <RootNavigator />
          <AlertComponent />
        </KeyboardProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    "Kanit-Bold": require("../assets/fonts/Kanit/Kanit-Bold.ttf"),
    "Kanit-Black": require("../assets/fonts/Kanit/Kanit-Black.ttf"),
    "Kanit-ExtraBold": require("../assets/fonts/Kanit/Kanit-ExtraBold.ttf"),
    "Kanit-SemiBold": require("../assets/fonts/Kanit/Kanit-SemiBold.ttf"),
  });

  const queryClient = useRef(
    new QueryClient({
      defaultOptions: { queries: { staleTime: 60_000, retry: 2 } },
    })
  ).current;

  // Si las fuentes no están cargadas, mantener splash screen
  if (!loaded) {
    return null;
  }

  return (
    <AlertProvider>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </SessionProvider>
    </AlertProvider>
  );
}
