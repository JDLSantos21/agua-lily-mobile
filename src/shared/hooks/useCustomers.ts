// src/hooks/useOrders.ts
import { getCustomerByID } from "@/api/customers";
import { useQuery } from "@tanstack/react-query";

export function useCustomer(id: number) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerByID(id),
    enabled: !!id,
  });
}
