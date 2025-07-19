import { updateCustomerLocation } from "./customers.api";
import { getCurrentLocation } from "@/shared/utils/location";

export async function saveCustomerLocation(customerId: number) {
  if (!customerId) {
    throw new Error(
      "Cliente no registrado. Solo se puede guardar la ubicación para clientes registrados."
    );
  }

  const { latitude, longitude } = await getCurrentLocation();

  const response = await updateCustomerLocation(customerId, {
    lat: latitude,
    lng: longitude,
  });

  if (!response.success) {
    throw new Error("No se pudo guardar la ubicación del cliente.");
  }

  return response;
}
