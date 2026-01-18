import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderStatus } from "@/types/orders.types";

interface StatusConfig {
  bg: string;
  textColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
}

export default function OrderStatusBadge({
  status,
  size = "md",
}: {
  status: OrderStatus;
  size?: "sm" | "md";
}) {
  const statusConfig: Record<OrderStatus, StatusConfig> = {
    pendiente: {
      bg: "#FEF3C7",
      textColor: "#92400E",
      icon: "time-outline",
      iconColor: "#D97706",
      label: "Pendiente",
    },
    preparando: {
      bg: "#DBEAFE",
      textColor: "#1E40AF",
      icon: "construct-outline",
      iconColor: "#2563EB",
      label: "Preparando",
    },
    despachado: {
      bg: "#F3E8FF",
      textColor: "#6B21A8",
      icon: "car-outline",
      iconColor: "#7C3AED",
      label: "En camino",
    },
    entregado: {
      bg: "#D1FAE5",
      textColor: "#065F46",
      icon: "checkmark-circle",
      iconColor: "#059669",
      label: "Entregado",
    },
    cancelado: {
      bg: "#FEE2E2",
      textColor: "#991B1B",
      icon: "close-circle",
      iconColor: "#DC2626",
      label: "Cancelado",
    },
  };

  const config = statusConfig[status] || statusConfig.pendiente;
  const isSmall = size === "sm";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: isSmall ? 10 : 14,
        paddingVertical: isSmall ? 6 : 8,
        borderRadius: 10,
        backgroundColor: config.bg,
      }}
      accessibilityLabel={`Estado: ${config.label}`}
      accessibilityRole="text"
    >
      <Ionicons
        name={config.icon}
        size={isSmall ? 16 : 18}
        color={config.iconColor}
      />
      <Text
        style={{
          marginLeft: 6,
          fontSize: isSmall ? 12 : 13,
          fontWeight: "600",
          color: config.textColor,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}
