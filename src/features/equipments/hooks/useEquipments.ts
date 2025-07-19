import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getEquipments,
  getEquipmentById,
  updateEquipmentLocation,
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
