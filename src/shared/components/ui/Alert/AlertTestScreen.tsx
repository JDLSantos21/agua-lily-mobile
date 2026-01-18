import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useAlert } from "@/shared/components/ui/Alert";

export default function AlertTestScreen() {
  const alert = useAlert();

  return (
    <View className="items-center justify-center flex-1 p-4 space-y-4">
      <Text className="mb-8 text-2xl font-bold">Prueba de Alertas</Text>

      <TouchableOpacity
        className="px-6 py-3 mb-4 bg-blue-500 rounded-lg"
        onPress={() =>
          alert.show("Información", "Esta es una alerta informativa")
        }
      >
        <Text className="font-semibold text-white">Mostrar Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-6 py-3 mb-4 bg-green-500 rounded-lg"
        onPress={() =>
          alert.success("¡Éxito!", "Operación completada correctamente")
        }
      >
        <Text className="font-semibold text-white">Mostrar Éxito</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-6 py-3 mb-4 bg-red-500 rounded-lg"
        onPress={() => alert.error("Error", "Algo salió mal")}
      >
        <Text className="font-semibold text-white">Mostrar Error</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-6 py-3 mb-4 bg-yellow-500 rounded-lg"
        onPress={() =>
          alert.warning("Advertencia", "Ten cuidado con esta acción")
        }
      >
        <Text className="font-semibold text-white">Mostrar Advertencia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-6 py-3 mb-4 bg-purple-500 rounded-lg"
        onPress={() =>
          alert.confirm(
            "Confirmar acción",
            "¿Estás seguro de que quieres continuar?",
            () => console.log("Confirmado"),
            () => console.log("Cancelado")
          )
        }
      >
        <Text className="font-semibold text-white">Confirmar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-6 py-3 bg-red-700 rounded-lg"
        onPress={() =>
          alert.confirmDestructive(
            "Eliminar elemento",
            "Esta acción no se puede deshacer",
            () => console.log("Eliminado"),
            () => console.log("Cancelado")
          )
        }
      >
        <Text className="font-semibold text-white">Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}
