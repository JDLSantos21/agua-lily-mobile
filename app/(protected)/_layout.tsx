// app/(protected)/_layout.tsx
import { Stack, Link, router } from "expo-router";
import AuthGuard from "@/shared/components/AuthGuard";
import { Text, Pressable, View } from "react-native";
import { Menu, User } from "lucide-react-native";
import { useDrawer } from "@/hooks/useDrawer";
import { useCallback } from "react";
import DrawerMenu from "@/components/DrawerMenu";

export default function ProtectedLayout() {
  const { drawerRef, openDrawer } = useDrawer();

  const handleMenuItemPress = useCallback((item: string) => {
    switch (item) {
      case "home":
        router.push("/");
        break;
      case "orders":
        router.push("/orders");
        break;
      case "profile":
        router.push("/profile");
        break;
      case "settings":
        router.push("/settings");
        break;
      case "notifications":
        router.push("/notifications");
        break;
      case "help":
        router.push("/help");
        break;
      case "logout":
        // Aquí implementarías la lógica de logout
        console.log("Cerrar sesión");
        break;
      default:
        break;
    }
  }, []);

  return (
    <AuthGuard>
      <DrawerMenu ref={drawerRef} onMenuItemPress={handleMenuItemPress}>
        <Stack
          screenOptions={{
            headerShown: true,
            headerTintColor: "#3B82F6",
            headerTitle: "",
            headerLeft: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  onPress={openDrawer}
                  className="p-2 mr-2 rounded-full bg-blue-100/50 active:bg-blue-200"
                >
                  <Menu size={24} color="#3B82F6" />
                </Pressable>
                <Text
                  style={{ fontFamily: "Kanit-Bold" }}
                  className="text-lg text-[#3B82F6]"
                >
                  PEDIDOS
                </Text>
              </View>
            ),
            headerRight: () => (
              <Link asChild href="/profile">
                <Pressable className="p-2 rounded-full bg-blue-100/50 active:bg-blue-200">
                  <User size={24} color="#3B82F6" />
                </Pressable>
              </Link>
            ),
          }}
        >
          {/* El grupo (tabs) es la primera pantalla del Stack */}
          <Stack.Screen name="(tabs)" />

          {/* cualquier otra pantalla fuera de tabs */}
          <Stack.Screen name="profile" />
          <Stack.Screen
            name="[tracking_code]"
            options={{ headerShown: true }}
          />
        </Stack>
      </DrawerMenu>
    </AuthGuard>
  );
}
