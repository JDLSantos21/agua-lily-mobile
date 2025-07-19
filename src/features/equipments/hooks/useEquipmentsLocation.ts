import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveEquipmentLocation } from "../services/equipments.service";
import { Alert } from "react-native";

export function useEquipmentsLocation() {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const saveLocation = async (id: number) => {
    try {
      setIsGettingLocation(true);
      setIsSaving(true);

      await saveEquipmentLocation(id);

      Alert.alert(
        "Ubicación guardada",
        "La ubicación del equipo se ha actualizado correctamente."
      );

      queryClient.invalidateQueries({ queryKey: ["equipment", id] });
    } catch (error: any) {
      console.log("Error al guardar la ubicación del equipo:", error);
      Alert.alert(
        "Ocurrió un problema",
        error.message ||
          "No se pudo guardar la ubicación del equipo. Inténtalo de nuevo más tarde."
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
}
