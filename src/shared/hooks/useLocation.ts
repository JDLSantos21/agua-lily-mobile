import { useState } from "react";
import { Alert } from "react-native";

export const useLocation = (tracking_code: string) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveLocation = async (customerId: number) => {
    try {
      setIsGettingLocation(true);
      setIsSaving(true);

      Alert.alert(
        "Ubicación guardada",
        "La ubicación del cliente se ha actualizado correctamente."
      );
    } catch (error: any) {
      console.log("Error al guardar la ubicación del cliente:", error);
      Alert.alert(
        "Ocurrió un problema",
        error.message ||
          "No se pudo guardar la ubicación del cliente. Inténtalo de nuevo más tarde."
      );
    } finally {
      setIsGettingLocation(false);
      setIsSaving(false);
    }
  };

  return {
    saveLocation,
    isGettingLocation,
    isSaving,
    isLoading: isGettingLocation || isSaving,
  };
};
