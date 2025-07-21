import Button from "@/shared/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function OrdersError({ refetch }: { refetch: () => void }) {
  return (
    <View className="items-center justify-center flex-1 px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
      <Text className="mt-4 text-xl font-semibold text-gray-700">
        Ocurrió un problema
      </Text>
      <Text className="mt-2 text-center text-gray-500">
        No pudimos cargar los pedidos. Verifica tu conexión e intenta
        nuevamente.
      </Text>
      <Button
        text="Reintentar"
        className="mt-6"
        icon="refresh"
        onPress={refetch}
        iconColor="white"
      />

      {/* <TouchableOpacity
        className="flex-row items-center px-6 py-3 mt-6 bg-blue-500 rounded-full"
        onPress={() => refetch()}
      >
        <Ionicons name="refresh" size={20} color="white" />
        <Text className="ml-2 font-medium text-white">Reintentar</Text>
      </TouchableOpacity> */}
    </View>
  );
}
