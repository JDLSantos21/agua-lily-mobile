import { api } from "@/lib/api";
import { Equipment } from "../types";

export const getEquipments = async () => {
  const res = await api.get("/equipments");
  return res.data;
};

export const getMobileEquipments = async () => {
  const res = await api.get("/equipments/mobile");
  return res.data;
};

// equipmet response

type EquipmentResponse = {
  data: Equipment;
  success: boolean;
};

export const getEquipmentById = async (id: string | number) => {
  console.log("Se hace fetch al equipo: ", id);
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

type RegisterEquipmentDeliveryResponse = {
  success: boolean;
  message: string;
};

export const registerEquipmentDelivery = async (
  id: number,
  latitude: number,
  longitude: number
) => {
  const res = await api.post(`/equipments/${id}/delivery`, {
    latitude,
    longitude,
  });
  return res.data as RegisterEquipmentDeliveryResponse;
};
