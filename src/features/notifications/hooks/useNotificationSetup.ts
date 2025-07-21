import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notificationHandlerService } from "../services/notificationHandler.service";
import { orderNotificationHandler } from "@/features/orders/handlers/orderNotificationHandler";

export function useNotificationSetup() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Configurar el query client en el servicio
    notificationHandlerService.setQueryClient(queryClient);

    // Registrar todos los handlers
    notificationHandlerService.registerHandler(orderNotificationHandler);

    // notificationHandlerService.registerHandler(equipmentNotificationHandler);

    return () => {
      // Cleanup si es necesario
      notificationHandlerService.unregisterHandler("order_update");
      notificationHandlerService.unregisterHandler("new_order");
      // notificationHandlerService.unregisterHandler("equipment_update");
    };
  }, [queryClient]);
}
