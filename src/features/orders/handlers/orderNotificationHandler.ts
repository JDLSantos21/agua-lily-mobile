import {
  NotificationHandler,
  notificationHandlerService,
} from "@/features/notifications/services/notificationHandler.service";
import { router } from "expo-router";

export const orderNotificationHandler: NotificationHandler = {
  type: "order_update",
  onReceived: (data) => {
    console.log(`📦 Pedido ${data.action}:`, data);

    // Invalidar queries comunes
    notificationHandlerService.invalidateQueries(["orders"]);
    notificationHandlerService.invalidateQueries(["lastOrders"]);

    // Acciones específicas según el tipo
    switch (data.action) {
      case "created":
        console.log("🆕 Procesando nuevo pedido");
        break;

      case "updated":
        console.log("🔄 Procesando actualización de pedido");
        if (data.entityCode)
          notificationHandlerService.invalidateQueries([
            "order",
            data.entityCode,
          ]);
        break;
      case "status_changed":
        if (data.entityCode)
          notificationHandlerService.invalidateQueries([
            "order",
            data.entityCode,
          ]);
        console.log(`🔄 Procesando ${data.action} de pedido`);
        break;

      case "deleted":
        console.log("🗑️ Procesando eliminación de pedido");
        break;

      default:
        console.log("❓ Acción desconocida:", data.action);
    }
  },
  onTapped: (data) => {
    console.log(`👆 Usuario tocó notificación de pedido ${data.action}:`, data);

    switch (data.action) {
      case "created":
        if (data.entityCode) router.push(`/${data.entityCode}`);
      case "updated":
        if (data.entityCode) router.push(`/${data.entityCode}`);
        break;
      case "status_changed":
        if (data.entityCode) {
          router.push(`/${data.entityCode}`);
        } else {
          router.push("/");
        }
        break;
      case "deleted":
        router.push("/");
        break;
      default:
        router.push("/");
    }
  },
};
