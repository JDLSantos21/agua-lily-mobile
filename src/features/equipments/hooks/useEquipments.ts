import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEquipments,
  getEquipmentById,
  updateEquipmentLocation,
  registerEquipmentDelivery,
} from "../services/equipments.api";

export function useEquipments() {
  return useQuery({
    queryKey: ["equipments"],
    queryFn: getEquipments,
  });
}

export function useEquipmentById(id: number) {
  return useQuery({
    queryKey: ["equipment", id],
    queryFn: () => getEquipmentById(id),
    enabled: !!id && !isNaN(id),
  });
}

export function useUpdateEquipmentLocation() {
  return useMutation({
    mutationFn: ({
      id,
      latitude,
      longitude,
    }: {
      id: number;
      latitude: number;
      longitude: number;
    }) => updateEquipmentLocation(id, latitude, longitude),
  });
}

export function useRegisterEquipmentDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      latitude,
      longitude,
    }: {
      id: number;
      latitude: number;
      longitude: number;
    }) => registerEquipmentDelivery(id, latitude, longitude),
    onSuccess: async (data, variables) => {
      // Invalidate both the individual equipment and the list
      await queryClient.invalidateQueries({ queryKey: ["mobile-equipments"] });

      // Invalidar todas las queries que empiecen con ["equipment"] para cubrir tanto ID como serial_number
      await queryClient.invalidateQueries({
        queryKey: ["equipment"],
        exact: false,
      });
    },
    onError: (error, variables) => {
      console.log(
        `Error registering equipment delivery for equipment ${variables.id}`,
        error,
      );
    },
  });
}
