// app/_layout.tsx
import "../global.css";

import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [loaded] = useFonts({
    "Kanit-Bold": require("../assets/fonts/Kanit/Kanit-Bold.ttf"),
    "Kanit-Black": require("../assets/fonts/Kanit/Kanit-Black.ttf"),
    "Kanit-ExtraBold": require("../assets/fonts/Kanit/Kanit-ExtraBold.ttf"),
    "Kanit-SemiBold": require("../assets/fonts/Kanit/Kanit-SemiBold.ttf"),
  });

  // 2️⃣  Query Client solo una vez
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: { queries: { staleTime: 60_000, retry: 2 } },
    })
  ).current;

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
