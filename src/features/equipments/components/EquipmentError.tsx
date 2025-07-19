import { Text, View, TouchableOpacity } from "react-native";
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react-native";

interface EquipmentErrorProps {
  onRetry?: () => void;
  errorMessage?: string;
}

export default function EquipmentError({
  onRetry,
  errorMessage = "Ocurrió un problema al cargar los detalles del equipo.",
}: EquipmentErrorProps = {}) {
  return (
    <View className="items-center justify-center flex-1 px-6 py-12 bg-gray-50">
      <View className="relative mb-8">
        <View className="items-center justify-center w-24 h-24 bg-orange-100 rounded-full">
          <AlertTriangle size={40} color="#f59e0b" />
        </View>
        <View className="absolute items-center justify-center w-8 h-8 bg-orange-500 rounded-full -bottom-2 -right-2">
          <Wifi size={16} color="white" />
        </View>
      </View>

      <Text className="mb-3 text-2xl font-bold text-center text-gray-900">
        Error de Conexión
      </Text>

      <Text className="max-w-sm mb-8 text-base leading-6 text-center text-gray-600">
        {errorMessage}
      </Text>

      <View className="w-full max-w-xs space-y-3">
        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="flex-row items-center justify-center px-6 py-4 bg-blue-600 rounded-lg shadow-sm active:bg-blue-700"
            activeOpacity={0.8}
          >
            <RefreshCw size={20} color="white" />
            <Text className="ml-2 text-base font-semibold text-white">
              Reintentar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Helper Text */}
      <Text className="max-w-xs mt-6 text-sm text-center text-gray-500">
        Verifica tu conexión a internet y vuelve a intentarlo.
      </Text>
    </View>
  );
}
