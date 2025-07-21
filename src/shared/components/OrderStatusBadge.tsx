import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderStatus } from "@/types/orders.types";

export default function OrderStatusBadge({
  status,
  size = "md",
}: {
  status: OrderStatus;
  size?: "sm" | "md";
}) {
  const statusConfig: {
    [key in OrderStatus]: {
      bg: string;
      textColor: string;
      icon: keyof typeof Ionicons.glyphMap;
      iconColor: string;
    };
  } = {
    pendiente: {
      bg: "#FEF3C7",
      textColor: "#92400E",
      icon: "time-outline",
      iconColor: "#D97706",
    },
    preparando: {
      bg: "#DBEAFE",
      textColor: "#1E40AF",
      icon: "sync-outline",
      iconColor: "#2563EB",
    },
    despachado: {
      bg: "#F3E8FF",
      textColor: "#6B21A8",
      icon: "car-outline",
      iconColor: "#7C3AED",
    },
    entregado: {
      bg: "#D1FAE5",
      textColor: "#065F46",
      icon: "checkmark-circle-outline",
      iconColor: "#059669",
    },
    cancelado: {
      bg: "#FEE2E2",
      textColor: "#991B1B",
      icon: "close-circle-outline",
      iconColor: "#DC2626",
    },
  };

  const config = statusConfig[status] || statusConfig.pendiente;

  return (
    <View
      className={`flex-row items-center w-[125px] justify-center ${size === "md" ? "px-4 py-3" : "px-3 py-2"}  rounded-2xl`}
      style={{
        backgroundColor: config.bg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <Ionicons name={config.icon} size={20} color={config.iconColor} />
      <Text
        className="ml-2 text-sm font-bold"
        style={{ color: config.textColor }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}
