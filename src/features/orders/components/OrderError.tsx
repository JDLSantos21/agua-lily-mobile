import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function OrderError({ orderId }: { orderId: string }) {
  return (
    <View className="items-center justify-center flex-1 px-6">
      <View className="items-center p-8 bg-white shadow-sm rounded-2xl">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="mt-4 text-lg font-semibold text-gray-700">
          Ocurrió un problema
        </Text>
        <Text className="mt-2 text-center text-gray-500">
          No se pudo encontrar el pedido #{orderId}
        </Text>
      </View>
    </View>
  );
}
