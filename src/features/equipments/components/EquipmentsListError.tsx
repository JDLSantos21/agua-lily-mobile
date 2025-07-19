import Button from "@/shared/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function EquipmentsListError({
  refetch,
}: {
  refetch: () => void;
}) {
  return (
    <View style={{ flex: 1 }} className="bg-gray-50">
      <View className="items-center justify-center flex-1 px-6">
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text className="mt-4 text-xl font-semibold text-gray-900">
          Error al cargar equipos
        </Text>
        <Text className="mt-2 text-center text-gray-600">
          Ocurrió un problema al cargar la lista de equipos.
        </Text>
        <Button
          onPress={refetch}
          variant="primary"
          text="Reintentar"
          icon="refresh"
          className="mt-6"
        />
      </View>
    </View>
  );
}
