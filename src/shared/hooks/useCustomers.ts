// src/hooks/useOrders.ts
import {
  getCustomerByID,
  updateCustomerLocation,
} from "@/features/customers/services/customers.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCustomer(id: number) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerByID(id),
    enabled: !!id,
  });
}

export function useUpdateCustomerLocation(
  id: number,
  location: { lat: number; lng: number }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateCustomerLocation(id, location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
    },
    onError: (error) => {
      console.log("Error updating customer location:", error);
    },
  });
}
