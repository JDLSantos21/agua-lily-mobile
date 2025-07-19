import { api } from "@/lib/api";
import { Equipment } from "../types";

export const getEquipments = async () => {
  const res = await api.get("/equipments");
  return res.data;
};

// equipmet response

type EquipmentResponse = {
  data: Equipment;
  success: boolean;
};

export const getEquipmentById = async (id: number) => {
  const res = await api.get(`/equipments/${id}`);
  return res.data as EquipmentResponse;
};

export const updateEquipmentLocation = async (
  id: number,
  latitude: number,
  longitude: number
) => {
  const res = await api.put(`/equipments/${id}/location`, {
    latitude,
    longitude,
  });
  return res.data;
};
