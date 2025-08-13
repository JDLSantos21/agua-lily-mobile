import { AxiosError } from "axios";

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  details?: string;
  code?: string;
  statusCode?: number;
}

export interface ErrorHandlerResult {
  title: string;
  message: string;
  statusCode?: number;
  originalError: unknown;
}

export interface ErrorHandlerOptions {
  customTitle?: string;
  customMessage?: string;
  fallbackTitle?: string;
  fallbackMessage?: string;
  showStatusCode?: boolean;
}

/**
 * Maneja errores de API de forma consistente
 * @param error - El error capturado
 * @param options - Opciones para personalizar el manejo del error
 * @returns Objeto con título y mensaje formateados
 */
export function handleApiError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): ErrorHandlerResult {
  const {
    customTitle,
    customMessage,
    fallbackTitle = "Error",
    fallbackMessage = "Ocurrió un error inesperado. Si el problema persiste, contacta al soporte técnico.",
    showStatusCode = false,
  } = options;

  // Si hay mensaje personalizado, usarlo directamente
  if (customTitle || customMessage) {
    return {
      title: customTitle || fallbackTitle,
      message: customMessage || fallbackMessage,
      originalError: error,
    };
  }

  // Manejar errores de Axios
  if (error instanceof AxiosError) {
    const response = error.response;
    const statusCode = response?.status;

    // Extraer mensaje del servidor
    const apiError = response?.data as ApiErrorResponse;
    let serverMessage =
      apiError?.error ||
      apiError?.message ||
      apiError?.details ||
      response?.statusText;

    // Títulos específicos por código de estado
    let title = fallbackTitle;
    if (statusCode) {
      switch (statusCode) {
        case 400:
          title = "Datos inválidos";
          break;
        case 401:
          title = "Datos de acceso inválidos";
          serverMessage =
            serverMessage || "Credenciales inválidas o sesión expirada";
          break;
        case 403:
          title = "Acceso denegado";
          serverMessage =
            serverMessage || "No tienes permisos para realizar esta acción";
          break;
        case 404:
          title = "No encontrado";
          serverMessage =
            serverMessage || "El recurso solicitado no fue encontrado";
          break;
        case 422:
          title = "Datos incorrectos";
          break;
        case 429:
          title = "Demasiadas solicitudes";
          serverMessage =
            serverMessage ||
            "Has excedido el límite de solicitudes. Intenta más tarde";
          break;
        case 500:
          title = "Error del servidor";
          serverMessage = serverMessage || "Error interno del servidor";
          break;
        case 502:
        case 503:
        case 504:
          title = "Servicio no disponible";
          serverMessage =
            serverMessage || "El servicio no está disponible temporalmente";
          break;
        default:
          title = `Error ${statusCode}`;
      }
    }

    // Agregar código de estado al mensaje si se solicita
    let finalMessage = serverMessage || fallbackMessage;
    if (showStatusCode && statusCode) {
      finalMessage = `${finalMessage} (Código: ${statusCode})`;
    }

    return {
      title,
      message: finalMessage,
      statusCode,
      originalError: error,
    };
  }

  // Manejar errores de red
  if (error instanceof Error) {
    if (
      error.message.includes("Network Error") ||
      error.message.includes("timeout")
    ) {
      return {
        title: "Error de conexión",
        message: "Verifica tu conexión a internet e intenta nuevamente",
        originalError: error,
      };
    }

    // Otros errores de JavaScript
    return {
      title: fallbackTitle,
      message: error.message || fallbackMessage,
      originalError: error,
    };
  }

  // Error desconocido
  return {
    title: fallbackTitle,
    message: fallbackMessage,
    originalError: error,
  };
}

/**
 * Versión simplificada que solo retorna el mensaje
 * @param error - El error capturado
 * @param customMessage - Mensaje personalizado opcional
 * @returns String con el mensaje de error
 */
export function getErrorMessage(
  error: unknown,
  customMessage?: string
): string {
  if (customMessage) {
    return customMessage;
  }

  const result = handleApiError(error);
  return result.message;
}

/**
 * Hook personalizado para usar con alertas
 * @param error - El error capturado
 * @param options - Opciones para personalizar el manejo del error
 * @returns Objeto listo para usar con alert.error()
 */
export function useApiErrorHandler(
  error: unknown,
  options: ErrorHandlerOptions = {}
) {
  const result = handleApiError(error, options);

  return {
    title: result.title,
    message: result.message,
    show: (alertFunction: (title: string, message: string) => void) => {
      alertFunction(result.title, result.message);
    },
  };
}

// Errores predefinidos comunes
export const CommonErrors = {
  NETWORK: {
    title: "Error de conexión",
    message: "Verifica tu conexión a internet e intenta nuevamente",
  },
  UNAUTHORIZED: {
    title: "Sesión expirada",
    message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente",
  },
  SERVER_ERROR: {
    title: "Error del servidor",
    message: "Error interno del servidor. Intenta más tarde",
  },
  VALIDATION: {
    title: "Datos incorrectos",
    message: "Verifica los datos ingresados e intenta nuevamente",
  },
} as const;
