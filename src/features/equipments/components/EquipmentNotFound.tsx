import { Text, View } from "react-native";
import { Search, AlertCircle } from "lucide-react-native";
import Button from "@/shared/components/ui/Button";

interface EquipmentNotFoundProps {
  onRetry?: () => void;
  onSearchAgain?: () => void;
}

export default function EquipmentNotFound({
  onRetry,
  onSearchAgain,
}: EquipmentNotFoundProps = {}) {
  return (
    <View className="items-center justify-center flex-1 px-6 py-12 bg-gray-50">
      {/* Icon Container */}
      <View className="relative mb-8">
        <View className="items-center justify-center w-24 h-24 bg-red-100 rounded-full">
          <Search size={40} color="#ef4444" />
        </View>
        <View className="absolute items-center justify-center w-8 h-8 bg-red-500 rounded-full -bottom-2 -right-2">
          <AlertCircle size={16} color="white" />
        </View>
      </View>

      {/* Title */}
      <Text className="mb-3 text-2xl font-bold text-center text-gray-900">
        Equipo no encontrado
      </Text>

      {/* Description */}
      <Text className="max-w-sm mb-8 text-base leading-6 text-center text-gray-600">
        El equipo que buscas no existe o ha sido eliminado del sistema.
      </Text>

      {/* Action Buttons */}
      <View className="w-full max-w-xs space-y-3">
        {onRetry && (
          <Button
            icon="refresh"
            text="Reintentar"
            variant="primary"
            onPress={onRetry}
          />
        )}
      </View>

      {/* Helper Text */}
      <Text className="max-w-xs mt-6 text-sm text-center text-gray-500">
        Verifica el código del equipo o contacta con soporte si el problema
        persiste.
      </Text>
    </View>
  );
}
