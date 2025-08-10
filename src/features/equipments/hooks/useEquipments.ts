import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEquipments,
  getMobileEquipments,
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

export function useMobileEquipments() {
  return useQuery({
    queryKey: ["mobile-equipments"],
    queryFn: getMobileEquipments,
    staleTime: 30000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useEquipmentById(id: string | number) {
  return useQuery({
    queryKey: ["equipment", String(id)],
    queryFn: () => getEquipmentById(id),
    enabled: !!id,
    staleTime: 30000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useUpdateEquipmentLocation() {
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
    }) => updateEquipmentLocation(id, latitude, longitude),
    onSuccess: async (data, variables) => {
      console.log("id: ", variables.id);
      await queryClient.invalidateQueries({ queryKey: ["mobile-equipments"] });
      // Invalidar todas las queries que empiecen con ["equipment"] para cubrir tanto ID como serial_number
      await queryClient.invalidateQueries({
        queryKey: ["equipment"],
        exact: false,
      });
    },
    onError: (error, variables) => {
      console.log(
        `Error updating equipment location for equipment ${variables.id}`,
        error
      );
    },
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
        error
      );
    },
  });
}
