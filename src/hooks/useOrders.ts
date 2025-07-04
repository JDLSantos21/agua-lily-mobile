// src/hooks/useOrders.ts
import { getOrders } from "@/api/orders";
import { useQuery } from "@tanstack/react-query";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
}
