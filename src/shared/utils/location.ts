// src/shared/utils/location.ts
import * as Location from "expo-location";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Timeout después de ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
};

export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  try {
    // Verificar permisos existentes
    const existingPermissions = await Location.getForegroundPermissionsAsync();
    let finalStatus = existingPermissions.status;

    // Solicitar permisos solo si no los tenemos
    if (existingPermissions.status !== "granted") {
      try {
        const permissionResponse = await withTimeout(
          Location.requestForegroundPermissionsAsync(),
          15000
        );
        finalStatus = permissionResponse.status;
      } catch {
        // Si hay timeout, verificar nuevamente los permisos
        const retryPermissions = await Location.getForegroundPermissionsAsync();
        if (retryPermissions.status === "granted") {
          finalStatus = retryPermissions.status;
        } else {
          throw new Error(
            "Timeout al solicitar permisos de ubicación. Intenta minimizar la app y volver a intentar."
          );
        }
      }
    }

    if (finalStatus !== "granted") {
      throw new Error("Permiso denegado");
    }

    // Obtener ubicación con timeout
    const location = await withTimeout(
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
      }),
      10000
    );

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    if (errorMessage.includes("Timeout")) {
      throw new Error(
        "La solicitud de ubicación tomó demasiado tiempo. Intenta minimizar la app y volver a intentar."
      );
    } else if (errorMessage.includes("Permiso denegado")) {
      throw new Error(
        "Los permisos de ubicación fueron denegados. Por favor, habilítalos en la configuración de la app."
      );
    } else {
      throw new Error(
        "No se pudo obtener la ubicación. Asegúrate de tener el GPS activado y los permisos concedidos."
      );
    }
  }
};
