// app/(protected)/_layout.tsx
import { Stack, Link } from "expo-router";
import AuthGuard from "@/shared/components/AuthGuard";
import { Image, Pressable } from "react-native";
import { User } from "lucide-react-native";
// import { useDrawer } from "@/hooks/useDrawer";
// import { useCallback } from "react";
// import DrawerMenu from "@/components/DrawerMenu";
import { StatusBar } from "expo-status-bar";

const logo = require("@assets/text-logo.png");

export default function ProtectedLayout() {
  // const { drawerRef } = useDrawer();

  // const handleMenuItemPress = useCallback((item: string) => {
  //   switch (item) {
  //     case "home":
  //       router.push("/");
  //       break;
  //     case "orders":
  //       router.push("/orders");
  //       break;
  //     case "profile":
  //       router.push("/profile");
  //       break;
  //     case "settings":
  //       router.push("/settings");
  //       break;
  //     case "notifications":
  //       router.push("/notifications");
  //       break;
  //     case "help":
  //       router.push("/help");
  //       break;
  //     case "logout":
  //       // Aquí implementarías la lógica de logout
  //       console.log("Cerrar sesión");
  //       break;
  //     default:
  //       break;
  //   }
  // }, []);

  return (
    <AuthGuard>
      <StatusBar style="dark" />
      {/* <DrawerMenu ref={drawerRef} onMenuItemPress={handleMenuItemPress}> */}
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
                    source={logo}
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
              <Link asChild href="/profile">
                <Pressable
                  className="p-2 rounded-full bg-blue-100/50 active:bg-blue-200"
                  style={{
                    width: 35,
                    height: 35,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 999,
                  }}
                >
                  <User size={24} color="#3B82F6" />
                </Pressable>
              </Link>
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
      {/* </DrawerMenu> */}
    </AuthGuard>
  );
}
