import {
  useAlert as useAlertHook,
  AlertOptions,
  AlertButton,
} from "./AlertContext";
import { useMemo } from "react";

// Hook personalizado para usar Alert dentro de componentes
export const useAlert = () => {
  const { showAlert, hideAlert } = useAlertHook();

  return useMemo(
    () => ({
      show: (title: string, message?: string, buttons?: AlertButton[]) =>
        showAlert({ title, message, buttons, type: "info" }),

      success: (title: string, message?: string, onPress?: () => void) =>
        showAlert({
          title,
          message,
          type: "success",
          buttons: [{ text: "OK", style: "default", onPress }],
        }),

      error: (title: string, message?: string, onPress?: () => void) =>
        showAlert({
          title,
          message,
          type: "error",
          buttons: [{ text: "OK", style: "default", onPress }],
        }),

      warning: (title: string, message?: string, onPress?: () => void) =>
        showAlert({
          title,
          message,
          type: "warning",
          buttons: [{ text: "OK", style: "default", onPress }],
        }),

      confirm: (
        title: string,
        message?: string,
        onConfirm?: () => void,
        onCancel?: () => void,
        confirmText: string = "Confirmar",
        cancelText: string = "Cancelar"
      ) =>
        showAlert({
          title,
          message,
          type: "confirm",
          buttons: [
            { text: cancelText, style: "cancel", onPress: onCancel },
            { text: confirmText, style: "default", onPress: onConfirm },
          ],
        }),

      confirmDestructive: (
        title: string,
        message?: string,
        onConfirm?: () => void,
        onCancel?: () => void,
        confirmText: string = "Eliminar",
        cancelText: string = "Cancelar"
      ) =>
        showAlert({
          title,
          message,
          type: "error",
          buttons: [
            { text: cancelText, style: "cancel", onPress: onCancel },
            { text: confirmText, style: "destructive", onPress: onConfirm },
          ],
        }),

      custom: (options: AlertOptions) => showAlert(options),
      hide: hideAlert,
    }),
    [showAlert, hideAlert]
  );
};
