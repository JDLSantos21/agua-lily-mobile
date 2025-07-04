// app/(protected)/_layout.tsx
import { Stack, Link } from "expo-router";
import AuthGuard from "@/shared/components/AuthGuard";
import { Text, Pressable } from "react-native";
import { User } from "lucide-react-native";

export default function ProtectedLayout() {
  return (
    <AuthGuard>
      <Stack
        screenOptions={{
          headerTintColor: "#3B82F6",
          headerTitle: "",
          headerLeft: () => (
            <Text
              style={{ fontFamily: "Kanit-Bold" }}
              className="text-lg text-[#3B82F6]"
            >
              PEDIDOS
            </Text>
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
        <Stack.Screen name="profile" options={{ title: "Perfil" }} />
        <Stack.Screen
          name="[tracking_code]"
          options={{ title: "Detalle del pedido" }}
        />
      </Stack>
    </AuthGuard>
  );
}
