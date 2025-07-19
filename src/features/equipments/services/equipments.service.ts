import { getCurrentLocation } from "@/shared/utils/location";
import { updateEquipmentLocation } from "./equipments.api";

export const saveEquipmentLocation = async (id: number) => {
  const { latitude, longitude } = await getCurrentLocation();
  console.log("Ubicación obtenida:", latitude, longitude);

  const res = await updateEquipmentLocation(id, latitude, longitude);

  if (!res.success) {
    throw new Error("No se pudo guardar la ubicación del cliente.");
  }

  return res;
};
