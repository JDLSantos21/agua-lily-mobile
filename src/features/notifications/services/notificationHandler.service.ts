// import { router } from "expo-router";
import * as Notifications from "expo-notifications";
// import { useQueryClient } from "@tanstack/react-query";

export interface NotificationData {
  type: string;
  [key: string]: any;
}

export interface NotificationHandler {
  type: string;
  onReceived?: (data: NotificationData) => void;
  onTapped?: (data: NotificationData) => void;
}

class NotificationHandlerService {
  private handlers: Map<string, NotificationHandler> = new Map();
  private queryClient: any = null;

  setQueryClient(client: any) {
    this.queryClient = client;
  }

  registerHandler(handler: NotificationHandler) {
    this.handlers.set(handler.type, handler);
  }

  unregisterHandler(type: string) {
    this.handlers.delete(type);
  }

  handleNotificationReceived(notification: Notifications.Notification) {
    const data = notification.request.content.data as NotificationData;
    const handler = this.handlers.get(data.type);

    if (handler?.onReceived) {
      handler.onReceived(data);
    }
  }

  handleNotificationTapped(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data as NotificationData;
    const handler = this.handlers.get(data.type);

    if (handler?.onTapped) {
      handler.onTapped(data);
    }
  }

  // Métodos de utilidad para invalidar queries
  invalidateQueries(queryKey: string[]) {
    if (this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey });
    }
  }
}

export const notificationHandlerService = new NotificationHandlerService();
