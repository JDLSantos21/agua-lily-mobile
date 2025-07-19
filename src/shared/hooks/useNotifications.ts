import * as Notifications from "expo-notifications";
import { useState, useEffect } from "react";

function useNotifications() {
  const [notificationStatus, setNotificationStatus] = useState(null);

  const getNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationStatus(status);
    return status;
  };

  useEffect(() => {
    console.log("Checking notification permissions...");
    getNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationStatus(status);
    return status;
  };

  // You can add more functions here to handle notifications, like scheduling, cancelling, etc.
  const scheduleNotification = async (content, trigger) => {
    await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const getAllScheduledNotifications = async () => {
    return await Notifications.getAllScheduledNotificationsAsync();
  };

  return {
    getNotificationPermissions,
    requestNotificationPermissions,
    scheduleNotification,
    cancelAllNotifications,
    getAllScheduledNotifications,
    notificationStatus,
  };
}

export default useNotifications;
