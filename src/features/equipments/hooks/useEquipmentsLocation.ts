import { useState } from "react";
import { useAlert } from "@/shared/components/ui/Alert";
import { useUpdateEquipmentLocation } from "./useEquipments";

export function useEquipmentsLocation() {
  const alert = useAlert();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { mutateAsync: updateLocation } = useUpdateEquipmentLocation();
  // const QueryClient = useQueryClient();

  const saveLocation = async (
    id: number,
    latitude: number,
    longitude: number
  ) => {
    try {
      setIsGettingLocation(true);
      setIsSaving(true);

      await updateLocation({ id, latitude, longitude });

      // QueryClient.invalidateQueries({ queryKey: ["equipment", String(id)] });

      alert.success(
        "Ubicación guardada",
        "La ubicación del equipo se ha actualizado correctamente."
      );
    } catch (error: any) {
      console.log("Error al guardar la ubicación del equipo:", error);
      alert.error(
        "Ocurrió un error al guardar ubicación",
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
