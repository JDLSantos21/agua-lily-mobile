import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveCustomerLocation } from "../services/customer.service";
import { useAlert } from "@/shared/components/ui/Alert";

export const useCustomerLocation = (tracking_code: string) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const alert = useAlert();
  const queryClient = useQueryClient();

  const saveLocation = async (customerId: number) => {
    try {
      setIsGettingLocation(true);
      setIsSaving(true);

      await saveCustomerLocation(customerId);

      alert.success(
        "Ubicación guardada",
        "La ubicación del cliente se ha actualizado correctamente."
      );

      queryClient.invalidateQueries({ queryKey: ["order", tracking_code] });
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
