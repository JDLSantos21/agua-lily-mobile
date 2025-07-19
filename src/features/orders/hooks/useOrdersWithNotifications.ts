import { useCallback, useEffect } from "react";
import { AppState } from "react-native";
import { useOrders } from "./useOrders";
import { OrderFilters } from "@/types/filters.types";
import { useQueryClient } from "@tanstack/react-query";
import { usePushNotifications } from "@/shared/hooks/usePushNotifications";

interface UseOrdersWithNotificationsProps {
  filters?: OrderFilters;
}

export function useOrdersWithNotifications({
  filters,
}: UseOrdersWithNotificationsProps) {
  const queryClient = useQueryClient();
  const ordersQuery = useOrders(filters);
  const { expoPushToken, notification } = usePushNotifications();

  // Función para actualizar pedidos
  const refreshOrders = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }, [queryClient]);

  // Escuchar notificaciones de pedidos
  useEffect(() => {
    if (notification?.request?.content?.data?.type === "order_update") {
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
