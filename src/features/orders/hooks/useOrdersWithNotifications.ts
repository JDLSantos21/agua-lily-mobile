import { useCallback, useEffect } from "react";
import { AppState } from "react-native";
import { useDriverOrders } from "./useOrders";
import { useQueryClient } from "@tanstack/react-query";
import { usePushNotifications } from "@/shared/hooks/usePushNotifications";

interface UseOrdersWithNotificationsProps {
  driverId: string | undefined;
}

export function useOrdersWithNotifications({
  driverId,
}: UseOrdersWithNotificationsProps) {
  const queryClient = useQueryClient();
  const ordersQuery = useDriverOrders(driverId);
  const { expoPushToken, notification } = usePushNotifications();

  // Función para actualizar pedidos del conductor
  const refreshOrders = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["driverOrders", driverId] });
  }, [queryClient, driverId]);

  // Escuchar SOLO notificaciones de asignación de pedidos
  // Ya no escuchamos "order_update" porque esas van a admin/operador
  useEffect(() => {
    const notificationType = notification?.request?.content?.data?.type;
    
    // Solo refrescar cuando es una asignación de pedido al usuario actual
    if (notificationType === "order_assigned") {
      refreshOrders();
    }
  }, [notification, refreshOrders]);

  // Actualizar cuando la app vuelve a estar activa
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        refreshOrders();
      }
    });

    return () => subscription.remove();
  }, [refreshOrders]);

  return {
    ...ordersQuery,
    hasNotifications: !!expoPushToken,
  };
}
