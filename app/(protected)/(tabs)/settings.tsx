import ScreenLayout from "@/shared/components/ScreenLayout";

import { ScrollView, Text, View } from "react-native";

export default function Settings() {
  return (
    <>
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
