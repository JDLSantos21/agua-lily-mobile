import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveCustomerLocation } from "../services/customer.service";
import { useAlert } from "@/shared/components/ui/Alert";

export const useCustomerLocation = (tracking_code: string) => {
  const alert = useAlert();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const saveLocation = async (customerId: number) => {
    try {
      setIsGettingLocation(true);
      setIsSaving(true);

      await saveCustomerLocation(customerId);

      alert.success(
        "Ubicación guardada",
        "La ubicación del cliente se ha actualizado correctamente.",
        () =>
          queryClient.invalidateQueries({ queryKey: ["order", tracking_code] }),
      );

      // Keep invalidation here or in callback?
      // Original code did it synchronously after Alert.alert (which is non-blocking on RN usually or blocking?)
      // Alert.alert in RN is async/callback based but the code below it runs immediately?
      // Actually Alert.alert doesn't block execution unless await is involved but Alert.alert doesn't return promise.
      // So queries were invalidated immediately.
      // alert.success shows a modal. We probably want invalidation to happen immediately or on close.
      // I'll leave the invalidation in the flow or callback.
      // But let's stick to simple replacement.
      // Note: alert.success might need an onPress callback to be 100% equivalent if we want to wait,
      // but original didn't wait.
      // Wait, original:
      // Alert.alert(...)
      // queryClient.invalidateQueries(...)
      // So it happened immediately.
    } catch (error: any) {
      console.log("Error al guardar la ubicación del cliente:", error);
      alert.error(
        "Ocurrió un problema",
        error.message ||
          "No se pudo guardar la ubicación del cliente. Inténtalo de nuevo más tarde.",
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
