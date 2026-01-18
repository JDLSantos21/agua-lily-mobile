// src/hooks/useOrders.ts
import {
  getOrderByCode,
  getOrders,
  getOrdersByDriver,
  updateOrderStatus,
  getLastOrders,
} from "@/features/orders/services/orders.api";
import { OrderStatus } from "@/types/orders.types";
import { OrderFilters } from "@/types/filters.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => getOrders(filters),
  });
}

// Hook para obtener pedidos asignados a un conductor específico
export function useDriverOrders(driverId: string | undefined) {
  return useQuery({
    queryKey: ["driverOrders", driverId],
    queryFn: () => getOrdersByDriver(driverId!),
    enabled: !!driverId,
  });
}

export function useLastOrders(limit: number = 10) {
  return useQuery({
    queryKey: ["lastOrders", limit],
    queryFn: () => getLastOrders(limit),
  });
}

export function useOrderByCode(code: string) {
  return useQuery({
    queryKey: ["order", code],
    queryFn: () => getOrderByCode(code),
    enabled: !!code,
  });
}

export function useUpdateOrderStatus(tracking_code: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: { status: OrderStatus; notes?: string | null };
    }) => updateOrderStatus(orderId, data),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con pedidos
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["driverOrders"] });
      queryClient.invalidateQueries({ queryKey: ["order", tracking_code] });
      queryClient.invalidateQueries({ queryKey: ["lastOrders"] });
    },
    onError: (error) => {
      console.error("Error updating order status:", error);
    },
  });
}
