import { useState } from "react";
import { useAlert } from "../components/ui/Alert";

export const useLocation = (tracking_code: string) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const alert = useAlert();

  const saveLocation = async (customerId: number) => {
    try {
      setIsGettingLocation(true);
      setIsSaving(true);

      alert.success(
        "Ubicación guardada",
        "La ubicación del cliente se ha actualizado correctamente."
      );
    } catch (error: any) {
      console.log("Error al guardar la ubicación del cliente:", error);
      alert.error(
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
