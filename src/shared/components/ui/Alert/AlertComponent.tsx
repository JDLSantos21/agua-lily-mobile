import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "../Modal";
import { useAlert, AlertButton } from "./AlertContext";

const getAlertIcon = (type: string) => {
  switch (type) {
    case "success":
      return { name: "checkmark-circle" as const, color: "#10B981" };
    case "warning":
      return { name: "warning" as const, color: "#F59E0B" };
    case "error":
      return { name: "close-circle" as const, color: "#EF4444" };
    case "confirm":
      return { name: "help-circle" as const, color: "#3B82F6" };
    default:
      return { name: "information-circle" as const, color: "#3B82F6" };
  }
};

const getButtonTextStyles = (style: string = "default") => {
  switch (style) {
    case "cancel":
      return "text-gray-700";
    case "destructive":
      return "text-red-700 font-semibold";
    default:
      return "text-blue-700 font-semibold";
  }
};

export const AlertComponent: React.FC = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert.visible) return null;

  const icon = getAlertIcon(alert.type || "info");

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    hideAlert();
  };

  const handleBackdropPress = () => {
    if (alert.cancelable) {
      hideAlert();
    }
  };

  return (
    <Modal
      isOpen={alert.visible}
      onBackdropPress={handleBackdropPress}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={200}
      animationOutTiming={150}
    >
      <View className="w-full max-w-sm mx-4 bg-white shadow-2xl rounded-3xl">
        {/* Header con ícono */}
        <View className="items-center pt-5 pb-4">
          <View className="items-center justify-center w-16 h-16 mb-2 rounded-full bg-gray-50">
            <Ionicons name={icon.name} size={32} color={icon.color} />
          </View>
          <Text className="px-4 text-xl font-bold text-center text-gray-900">
            {alert.title}
          </Text>
        </View>

        {/* Mensaje */}
        {alert.message && (
          <View className="px-6 pb-6">
            <Text className="text-base leading-relaxed text-center text-gray-600">
              {alert.message}
            </Text>
          </View>
        )}

        {/* Botones */}
        <View className="border-t border-gray-100">
          {alert.buttons && alert.buttons.length === 1 ? (
            // Un solo botón
            <TouchableOpacity
              className="px-6 py-4"
              onPress={() => handleButtonPress(alert.buttons![0])}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center text-lg font-semibold ${getButtonTextStyles(alert.buttons[0].style)}`}
              >
                {alert.buttons[0].text}
              </Text>
            </TouchableOpacity>
          ) : (
            // Múltiples botones
            <View
              className={
                alert.buttons && alert.buttons.length === 2 ? "flex-row" : ""
              }
            >
              {alert.buttons?.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  className={`
                    py-4 px-6 
                    ${alert.buttons!.length === 2 ? "flex-1" : ""} 
                    ${
                      index < alert.buttons!.length - 1
                        ? alert.buttons!.length === 2
                          ? "border-r border-gray-100"
                          : "border-b border-gray-100"
                        : ""
                    }
                  `}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-center text-lg ${getButtonTextStyles(button.style)}`}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
