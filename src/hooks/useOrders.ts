// src/hooks/useOrders.ts
import { getOrderByCode, getOrders, updateOrderStatus } from "@/api/orders";
import { OrderStatus } from "@/types/orders.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", tracking_code] });
      console.log("Order status updated successfully:", variables.data.status);
    },
    onError: (error) => {
      console.error("Error updating order status:", error);
    },
  });
}
