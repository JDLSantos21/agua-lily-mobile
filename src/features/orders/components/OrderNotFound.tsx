import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function OrderNotFound({ orderId }: { orderId: string }) {
  return (
    <View className="items-center justify-center flex-1 px-6">
      <View className="items-center p-8 bg-white shadow-sm rounded-2xl">
        <Ionicons name="document-outline" size={48} color="#9CA3AF" />
        <Text className="mt-4 text-lg font-semibold text-gray-700">
          Pedido no encontrado
        </Text>
        <Text className="mt-2 text-center text-gray-500">
          El pedido #{orderId} no existe en el sistema
        </Text>
      </View>
    </View>
  );
}
