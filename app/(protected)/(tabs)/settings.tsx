import ScreenLayout from "@/shared/components/ScreenLayout";
import { router, Stack } from "expo-router";
import { ArrowLeft, SettingsIcon } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Settings() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              className="p-2 rounded-full bg-gray-100/50 active:bg-gray-200"
            >
              <ArrowLeft size={24} color="#6B7280" />
            </Pressable>
          ),
          headerRight: () => (
            <View className="flex-row items-center gap-2">
              <SettingsIcon size={24} color="#6B7280" />
              <Text
                style={{ fontFamily: "Kanit-Bold" }}
                className="text-lg text-gray-700"
              >
                CONFIGURACIÓN
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: "#F9FAFB",
          },
        }}
      />
      <ScreenLayout>
        <ScrollView className="bg-gray-50">
          <Text className="mb-8 text-2xl font-bold text-gray-700">
            Configuración
          </Text>

          <View className="p-4 mb-4 bg-white rounded-lg shadow-sm">
            <Text className="mb-4 text-gray-600">
              Aquí puedes ajustar las preferencias de la aplicación.
            </Text>
          </View>

          <View className="p-4 mb-4 bg-white rounded-lg shadow-sm">
            <Text className="mb-4 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>

          <View className="p-4 mb-4 bg-white rounded-lg shadow-sm">
            <Text className="mb-4 text-gray-600">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}
