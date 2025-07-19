// src/shared/utils/location.ts
import * as Location from "expo-location";

export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permiso denegado");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.log("Error al obtener ubicación:", error);
    throw new Error(
      "No se pudo obtener la ubicación. Asegúrate de tener el GPS activado."
    );
  }
};
