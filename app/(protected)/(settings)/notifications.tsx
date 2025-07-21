import ScreenLayout from "@/shared/components/ScreenLayout";
import { Stack } from "expo-router";
import { Text, TouchableOpacity, View, Alert, AppState } from "react-native";
import { authStore } from "@/store/auth.store";
import { registerForPushNotificationsAsync } from "@/shared/utils/registerForPushNotificationsAsync";
import { Ionicons } from "@expo/vector-icons";
import { openAppSettings } from "@/shared/utils/openAppSettings";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

export default function NotificationsScreen() {
  const [status, setStatus] = useState<Notifications.PermissionStatus>();
  const { user } = authStore();

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setStatus(status);
  };

  useEffect(() => {
    checkPermissions();

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        checkPermissions();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  const isEnabled = status === "granted";

  const handleToggleNotifications = async () => {
    if (isEnabled) {
      Alert.alert(
        "Desactivar notificaciones",
        "¿Deseas ir a la configuración para desactivar las notificaciones?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Ir a Configuración",
            style: "default",
            onPress: openAppSettings,
          },
        ]
      );
    } else {
      try {
        await registerForPushNotificationsAsync(user.id);
      } catch {
        Alert.alert(
          "Error",
          "No se pudieron activar las notificaciones. ¿Deseas ir a la configuración para activarlas manualmente?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Ir a Configuración",
              style: "default",
              onPress: openAppSettings,
            },
          ]
        );
      }
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Notificaciones",
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
      <ScreenLayout>
        <View className="flex-1 px-4 py-6">
          {/* Header Info */}
          <View className="mb-6">
            <Text className="mb-2 text-2xl font-bold text-gray-900">
              Configuración de Notificaciones
            </Text>
            <Text className="leading-5 text-gray-600">
              Gestiona tus preferencias de notificaciones para mantenerte
              informado sobre actualizaciones importantes.
            </Text>
          </View>

          {/* Status Card */}
          <View className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                    isEnabled ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <Ionicons
                    name={isEnabled ? "notifications" : "notifications-off"}
                    size={24}
                    color={isEnabled ? "#10B981" : "#EF4444"}
                  />
                </View>
                <View>
                  <Text className="text-lg font-semibold text-gray-900">
                    Notificaciones
                  </Text>
                  <Text
                    className={`text-sm font-medium ${
                      isEnabled ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isEnabled ? "Habilitadas" : "Deshabilitadas"}
                  </Text>
                </View>
              </View>

              {/* Status indicator */}
              <View
                className={`w-3 h-3 rounded-full ${
                  isEnabled ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </View>

            <Text className="mb-6 text-sm text-gray-600">
              {isEnabled
                ? "Recibirás notificaciones sobre actualizaciones, recordatorios y información importante."
                : "Activa las notificaciones para no perderte información importante y mantenerte al día."}
            </Text>

            {/* Action Button */}
            <TouchableOpacity
              className={`py-4 px-6 rounded-xl flex-row items-center justify-center ${
                isEnabled
                  ? "bg-gray-100 border border-gray-200"
                  : "bg-blue-500 shadow-lg shadow-blue-500/25"
              }`}
              onPress={handleToggleNotifications}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isEnabled ? "settings" : "notifications"}
                size={20}
                color={isEnabled ? "#6B7280" : "#FFFFFF"}
                style={{ marginRight: 8 }}
              />
              <Text
                className={`font-semibold ${
                  isEnabled ? "text-gray-700" : "text-white"
                }`}
              >
                {isEnabled ? "Ir a Configuración" : "Activar Notificaciones"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Cards */}
          <View className="space-y-4">
            <View className="p-4 border border-blue-100 bg-blue-50 rounded-xl">
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text className="ml-2 font-semibold text-blue-900">
                  ¿Cómo funcionan?
                </Text>
              </View>
              <Text className="text-sm text-blue-800">
                Las notificaciones te mantienen informado sobre los pedidos en
                tiempo real, recordatorios y actualizaciones de la aplicación.
              </Text>
            </View>

            {!isEnabled && (
              <View className="p-4 mt-4 border bg-amber-50 rounded-xl border-amber-100">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="warning" size={20} color="#F59E0B" />
                  <Text className="ml-2 font-semibold text-amber-900">
                    Notificaciones desactivadas
                  </Text>
                </View>
                <Text className="text-sm text-amber-800">
                  Para recibir alertas importantes, te recomendamos activar las
                  notificaciones.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}
