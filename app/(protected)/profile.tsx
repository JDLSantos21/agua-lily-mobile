"use client";

import ScreenLayout from "@/shared/components/ScreenLayout";
import { router, Stack } from "expo-router";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAlert } from "@/shared/components/ui/Alert";
import { useSession } from "@/context/AuthContext";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { signOut } = useSession();
  const alert = useAlert();
  const { session } = useSession();

  const user = session?.user;

  const handleSignOut = () => {
    alert.confirm(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      () => signOut()
    );
  };

  interface ProfileCardProps {
    children: React.ReactNode;
    className?: string;
  }

  const ProfileCard = ({ children, className = "" }: ProfileCardProps) => (
    <View className={`bg-white rounded-2xl shadow-sm mx-4 mb-4 ${className}`}>
      {children}
    </View>
  );

  interface ProfileOptionProps {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    title: string;
    subtitle?: string;
    variant?: "default" | "danger";
  }

  const ProfileOption = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    variant = "default",
  }: ProfileOptionProps & { onPress: () => void; showArrow?: boolean }) => {
    const textColor = variant === "danger" ? "text-red-600" : "text-gray-900";
    const iconColor = variant === "danger" ? "#DC2626" : "#6B7280";

    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center p-4 active:bg-gray-50"
        activeOpacity={0.7}
      >
        <View className="items-center justify-center w-10 h-10 mr-4 bg-gray-100 rounded-full">
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className={`font-medium ${textColor}`}>{title}</Text>
          {subtitle && (
            <Text className="mt-1 text-sm text-gray-500">{subtitle}</Text>
          )}
        </View>
        {showArrow && (
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    );
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "Administrador",
      driver: "Chofer",
      administrativo: "Administrativo",
      supervisor: "Supervisor",
      operador: "Operador",
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      admin: "bg-purple-100 text-purple-700",
      operador: "bg-blue-100 text-blue-700",
      administrativo: "bg-green-100 text-green-700",
      driver: "bg-gray-100 text-gray-700",
      supervisor: "bg-yellow-100 text-yellow-700",
    };
    return colorMap[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Perfil",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#1F2937",
            fontSize: 18,
            fontWeight: "600",
          },
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerShadowVisible: true,
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />
      <ScreenLayout className="bg-gray-100">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Header del perfil */}
          <View className="items-center py-8 mb-4 bg-white">
            {/* Avatar */}
            <View className="items-center justify-center w-24 h-24 mb-4 bg-blue-500 rounded-full">
              <Text className="text-2xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>

            {/* Información del usuario */}
            <Text className="text-xl font-bold text-gray-900">
              {user?.name || "Usuario"}
            </Text>
            <View
              className={`px-3 py-1 mt-2 rounded-full ${getRoleBadgeColor(user?.role || "user")}`}
            >
              <Text className="text-sm font-medium">
                {getRoleDisplayName(user?.role || "user")}
              </Text>
            </View>
          </View>

          {/* Información personal */}
          <ProfileCard>
            <View className="p-4 border-b border-gray-50">
              <Text className="text-lg font-semibold text-gray-900">
                Información personal
              </Text>
            </View>
            <View className="p-4 space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={16} color="#6B7280" />
                <Text className="ml-3 text-gray-600">
                  ID: {user?.id || "No disponible"}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="shield-outline" size={16} color="#6B7280" />
                <Text className="ml-3 text-gray-600">
                  Rol: {getRoleDisplayName(user?.role || "user")}
                </Text>
              </View>
            </View>
          </ProfileCard>

          {/* Configuración */}
          <ProfileCard>
            <View className="p-4 border-b border-gray-50">
              <Text className="text-lg font-semibold text-gray-900">
                Configuración
              </Text>
            </View>
            <View>
              <ProfileOption
                icon="notifications-outline"
                title="Notificaciones"
                subtitle="Gestionar alertas y notificaciones"
                onPress={() =>
                  router.push("/(protected)/(settings)/notifications")
                }
              />
              <View className="h-px mx-4 bg-gray-100" />
              <ProfileOption
                icon="moon-outline"
                title="Tema"
                subtitle="Cambiar entre modo claro y oscuro"
                onPress={() =>
                  alert.show(
                    "Tema",
                    "Actualmente solo está disponible el modo claro"
                  )
                }
              />
              <View className="h-px mx-4 bg-gray-100" />
              <ProfileOption
                icon="language-outline"
                title="Idioma"
                subtitle="Español"
                onPress={() =>
                  alert.show(
                    "Idioma",
                    "Actualmente solo está disponible el idioma español"
                  )
                }
              />
            </View>
          </ProfileCard>

          {/* Soporte */}
          <ProfileCard>
            <View className="p-4 border-b border-gray-50">
              <Text className="text-lg font-semibold text-gray-900">
                Soporte
              </Text>
            </View>
            <View>
              <ProfileOption
                icon="help-circle-outline"
                title="Ayuda"
                subtitle="Preguntas frecuentes y soporte"
                onPress={() =>
                  alert.show("Ayuda", "Contacta con soporte para obtener ayuda")
                }
              />
              <View className="h-px mx-4 bg-gray-100" />
              <ProfileOption
                icon="information-circle-outline"
                title="Acerca de"
                subtitle="Versión 1.0.0"
                onPress={() =>
                  alert.show(
                    "Acerca de",
                    "Aplicación de gestión de pedidos v1.0.0"
                  )
                }
              />
            </View>
          </ProfileCard>

          {/* Cerrar sesión */}
          <ProfileCard>
            <ProfileOption
              icon="log-out-outline"
              title="Cerrar sesión"
              subtitle="Salir de tu cuenta"
              onPress={handleSignOut}
              showArrow={false}
              variant="danger"
            />
          </ProfileCard>

          {/* Footer */}
          <View className="items-center mt-4">
            <Text className="text-xs text-gray-400">Versión 1.0.0</Text>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}
