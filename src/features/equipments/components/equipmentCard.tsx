import { Text, View, Pressable } from "react-native";
import { Equipment } from "../types";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// Status badge colors
const getStatusConfig = (status: string) => {
  const configs: Record<string, { bg: string; text: string; label: string }> = {
    activo: { bg: "#D1FAE5", text: "#065F46", label: "Activo" },
    inactivo: { bg: "#FEE2E2", text: "#991B1B", label: "Inactivo" },
    mantenimiento: { bg: "#FEF3C7", text: "#92400E", label: "Mantenim." },
    reparacion: { bg: "#DBEAFE", text: "#1E40AF", label: "Reparación" },
  };
  return configs[status?.toLowerCase()] || configs.activo;
};

export default function EquipmentCard({
  equipment,
}: {
  equipment?: Equipment;
}) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const statusConfig = getStatusConfig(equipment?.status || "activo");
  // Entrega pendiente: tiene assigned_date pero no tiene location_created_at
  const isPendingDelivery =
    equipment?.assigned_date && !equipment?.location_created_at;

  return (
    <Link href={`/equipments/${equipment?.id}`} asChild>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        })}
        accessibilityLabel={`Equipo ${equipment?.model}, tipo ${equipment?.type}`}
        accessibilityRole="button"
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            marginHorizontal: 2, // Slight margin
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Header: Tipo/Modelo y Status */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: 14,
                paddingBottom: 10,
              }}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {equipment?.type}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: "#111827",
                    marginTop: 2,
                  }}
                >
                  {equipment?.model}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#9CA3AF",
                    marginTop: 2,
                  }}
                >
                  #{equipment?.serial_number || "Sin serie"}
                </Text>
              </View>

              {/* Badge de estado */}
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 10,
                  backgroundColor: statusConfig.bg,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: statusConfig.text,
                  }}
                >
                  {statusConfig.label}
                </Text>
              </View>
            </View>

            {/* Cliente o Alerta */}
            <View style={{ paddingHorizontal: 14, paddingBottom: 10 }}>
              {equipment?.current_customer_id ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="person-outline" size={14} color="#9CA3AF" />
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      marginLeft: 6,
                      fontSize: 13,
                      color: "#6B7280",
                    }}
                  >
                    {equipment?.customer_name || "Cliente"}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FEF3C7",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                >
                  <Ionicons name="alert-circle" size={14} color="#D97706" />
                  <Text
                    style={{
                      marginLeft: 6,
                      fontSize: 12,
                      fontWeight: "500",
                      color: "#92400E",
                    }}
                  >
                    Sin cliente asociado
                  </Text>
                </View>
              )}
            </View>

            {/* Footer: Capacidad, alerta GPS y chevron */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 14,
                paddingVertical: 12,
                backgroundColor: "#FAFAFA",
                borderTopWidth: 1,
                borderTopColor: "#F3F4F6",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Ionicons name="water-outline" size={14} color="#9CA3AF" />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                >
                  {equipment?.capacity || "N/A"}
                </Text>

                {/* Indicador de entrega pendiente */}
                {isPendingDelivery && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 12,
                      backgroundColor: "#FEF3C7",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 6,
                    }}
                  >
                    <Ionicons name="time" size={12} color="#D97706" />
                    <Text
                      style={{
                        marginLeft: 4,
                        fontSize: 11,
                        fontWeight: "500",
                        color: "#92400E",
                      }}
                    >
                      Entrega pendiente
                    </Text>
                  </View>
                )}
              </View>

              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
