// app/(protected)/_layout.tsx
import { Stack, Link, router } from "expo-router";
import AuthGuard from "@/shared/components/AuthGuard";
import { Image, Pressable } from "react-native";
import { User } from "lucide-react-native";

import { StatusBar } from "expo-status-bar";

export default function ProtectedLayout() {
  return (
    <AuthGuard>
      <StatusBar style="dark" />

      <Stack>
        {/* El grupo (tabs) es la primera pantalla del Stack */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () => (
              <Link asChild href="/">
                <Pressable
                  style={{
                    zIndex: 999,
                    width: 120,
                    height: 35,
                  }}
                >
                  <Image
                    source={require("../../assets/logo.png")}
                    style={{
                      width: 120,
                      height: 35,
                      resizeMode: "contain",
                    }}
                  />
                </Pressable>
              </Link>
            ),
            headerRight: () => (
              <Pressable
                className="p-2 rounded-full bg-blue-100/50 active:bg-blue-200"
                style={{
                  width: 35,
                  height: 35,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 999,
                }}
                onPress={() => {
                  console.log("Profile pressed");
                  // Navegar programáticamente
                  router.push("/profile");
                }}
              >
                <User size={24} color="#3B82F6" />
              </Pressable>
            ),
          }}
        />
        {/* cualquier otra pantalla fuera de tabs */}
        <Stack.Screen name="profile" />
        <Stack.Screen
          name="[tracking_code]"
          options={{ headerBackTitle: "Atrás" }}
        />
      </Stack>
    </AuthGuard>
  );
}
