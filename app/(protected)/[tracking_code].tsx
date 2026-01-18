import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import formatPhoneNumber from "@/shared/utils/format-number";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import {
  useOrderByCode,
  useUpdateOrderStatus,
} from "@/features/orders/hooks/useOrders";
import Loading from "@/shared/components/Loading";
import { openInMaps } from "@/shared/utils/maps";
import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import OrderNotFound from "@/features/orders/components/OrderNotFound";
import OrderError from "@/features/orders/components/OrderError";
import { useCustomerLocation } from "@/features/customers/hooks/useCustomerLocation";
import OrderStatusBottomSheet from "@/features/orders/components/OrderStatusBottomSheet";
import Button from "@/shared/components/ui/Button";
import formatDate from "@/shared/utils/format-date";
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAlert } from "@/shared/components/ui/Alert";

dayjs.locale(es);

export default function OrderDetails() {
  const alert = useAlert();
  const { tracking_code } = useLocalSearchParams();
  const trackingCode = Array.isArray(tracking_code)
    ? tracking_code[0]
    : tracking_code;
  const bottomSheetRef = useRef(null);
  const {
    data: orderInfo,
    refetch,
    isLoading,
    isError,
  } = useOrderByCode(trackingCode);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { saveLocation, isLoading: isLoadingLocation } =
    useCustomerLocation(trackingCode);

  const { mutateAsync: updateOrderStatus, isPending } =
    useUpdateOrderStatus(trackingCode);

  const opacity = useSharedValue(0);

  const handleSnapPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bottomSheetRef.current?.open();
    setIsSheetOpen(true);
    opacity.value = withTiming(1, { duration: 300 });
  };

  const handleCloseSheet = () => {
    opacity.value = withTiming(0, { duration: 200 }, () =>
      runOnJS(setIsSheetOpen)(false),
    );
  };

  const handleSaveLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    alert.show(
      "Guardar ubicación",
      "¿Deseas guardar la ubicación GPS actual como dirección exacta del cliente?",
      [
        { text: "Cancelar", style: "destructive" },
        {
          text: "Guardar",
          style: "default",
          onPress: async () => {
            await saveLocation(orderInfo.data.customer_id);
          },
        },
      ],
    );
  };

  const handleGoToLocation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openInMaps(orderInfo.data.customer_address, {
      lat: orderInfo.data.coordinates_lat,
      lng: orderInfo.data.coordinates_lng,
    });
  };

  const handleMarkAsDelivered = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    alert.show(
      "Confirmar entrega",
      "¿Estás seguro de que quieres marcar este pedido como entregado?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "default",
          onPress: async () => {
            try {
              await updateOrderStatus({
                orderId: orderInfo.data.id,
                data: {
                  status: "entregado",
                  notes: "Pedido completado por conductor.",
                },
              });
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              alert.success(
                "Éxito",
                "El pedido ha sido marcado como entregado correctamente.",
              );
            } catch {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              alert.error(
                "Ocurrió un problema",
                "No se pudo marcar el pedido como entregado. Inténtalo más tarde.",
              );
            }
          },
        },
      ],
    );
  };

  // Componente de Card reutilizable
  const Card = ({ children, style = {} }) => (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        ...style,
      }}
    >
      {children}
    </View>
  );

  // Header de sección
  const SectionHeader = ({
    icon,
    iconColor,
    iconBg,
    title,
    rightElement = null,
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text
        style={{
          marginLeft: 14,
          fontSize: 18,
          fontWeight: "600",
          color: "#111827",
          flex: 1,
        }}
      >
        {title}
      </Text>
      {rightElement}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `#${tracking_code}`,
          headerTitleStyle: {
            color: "#111827",
            fontSize: 17,
            fontWeight: "600",
          },
          headerTintColor: "#3B82F6",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerShadowVisible: false,
        }}
      />

      {isLoading ? (
        <Loading
          title="Cargando detalles"
          message="Obteniendo información del pedido..."
        />
      ) : isError ? (
        <OrderError orderId={trackingCode} />
      ) : !orderInfo.data ? (
        <OrderNotFound orderId={trackingCode} />
      ) : (
        <>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                colors={["#3B82F6"]}
                tintColor="#3B82F6"
              />
            }
          >
            {/* Status Header */}
            <Card>
              <View style={{ padding: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Pedido #{trackingCode}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: "#111827",
                        marginTop: 4,
                      }}
                    >
                      {formatDate(orderInfo.data.created_at)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleSnapPress}
                    activeOpacity={0.7}
                    accessibilityLabel="Ver historial de estados"
                    accessibilityRole="button"
                  >
                    <OrderStatusBadge status={orderInfo.data.order_status} />
                  </TouchableOpacity>
                </View>

                {/* Info de entrega */}
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#F9FAFB",
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#6B7280",
                        marginBottom: 4,
                      }}
                    >
                      Fecha de entrega
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {formatDate(
                        orderInfo.data.scheduled_delivery_date,
                        "DD MMM, YYYY",
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 1,
                      backgroundColor: "#E5E7EB",
                      marginHorizontal: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#6B7280",
                        marginBottom: 4,
                      }}
                    >
                      Horario
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {orderInfo.data.delivery_time_slot || "No especificado"}
                    </Text>
                  </View>
                </View>

                {orderInfo.data.delivery_notes && (
                  <View
                    style={{
                      marginTop: 16,
                      padding: 14,
                      backgroundColor: "#FEF3C7",
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        color: "#92400E",
                      }}
                    >
                      📝 {orderInfo.data.delivery_notes}
                    </Text>
                  </View>
                )}
              </View>
            </Card>

            {/* Cliente */}
            <Card>
              <SectionHeader
                icon="person"
                iconColor="#3B82F6"
                iconBg="#DBEAFE"
                title="Cliente"
              />
              <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: "#111827",
                    marginBottom: 16,
                  }}
                >
                  {orderInfo.data.customer_name}
                </Text>

                {/* Teléfono */}
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${orderInfo.data.customer_phone}`)
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 14,
                    backgroundColor: "#F0FDF4",
                    borderRadius: 14,
                    marginBottom: 10,
                  }}
                  accessibilityLabel={`Llamar a ${orderInfo.data.customer_phone}`}
                  accessibilityRole="button"
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: "#10B981",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="call" size={18} color="#FFFFFF" />
                  </View>
                  <Text
                    style={{
                      marginLeft: 12,
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#065F46",
                    }}
                  >
                    {formatPhoneNumber(orderInfo.data.customer_phone)}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#10B981"
                    style={{ marginLeft: "auto" }}
                  />
                </TouchableOpacity>

                {/* Dirección */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    padding: 14,
                    backgroundColor: "#FFF7ED",
                    borderRadius: 14,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: "#F97316",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="location" size={18} color="#FFFFFF" />
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 15,
                      lineHeight: 22,
                      color: "#9A3412",
                    }}
                  >
                    {orderInfo.data.customer_address}
                  </Text>
                </View>

                {/* GPS Status */}
                {orderInfo.data.customer_id && (
                  <View style={{ marginTop: 14 }}>
                    {orderInfo.data.coordinates_lat &&
                    orderInfo.data.coordinates_lng ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 14,
                          backgroundColor: "#F0FDF4",
                          borderRadius: 14,
                        }}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#10B981"
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "500",
                              color: "#065F46",
                            }}
                          >
                            Ubicación GPS guardada
                          </Text>
                          <Text style={{ fontSize: 12, color: "#10B981" }}>
                            {formatDate(orderInfo.data.coordinates_saved_at)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={handleSaveLocation}
                          disabled={isLoadingLocation}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: "#10B981",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          accessibilityLabel="Actualizar ubicación"
                        >
                          <Ionicons name="refresh" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={{
                          padding: 14,
                          backgroundColor: "#FEF3C7",
                          borderRadius: 14,
                          borderWidth: 1,
                          borderColor: "#FCD34D",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                          }}
                        >
                          <Ionicons name="warning" size={20} color="#D97706" />
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "500",
                                color: "#92400E",
                                marginBottom: 4,
                              }}
                            >
                              GPS no guardado
                            </Text>
                            <Text
                              style={{
                                fontSize: 13,
                                color: "#B45309",
                                marginBottom: 12,
                              }}
                            >
                              Guarda la ubicación exacta para entregas más
                              precisas
                            </Text>
                            <Button
                              onPress={handleSaveLocation}
                              variant="location"
                              text="Guardar ubicación actual"
                              icon="location"
                              disabled={isLoadingLocation}
                              size="sm"
                            />
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </Card>

            {/* Productos */}
            <Card>
              <SectionHeader
                icon="cube"
                iconColor="#111827"
                iconBg="#F3F4F6"
                title="Productos"
                rightElement={
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      backgroundColor: "#F3F4F6",
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: "#4B5563",
                      }}
                    >
                      {orderInfo.data.items.length}{" "}
                      {orderInfo.data.items.length === 1 ? "item" : "items"}
                    </Text>
                  </View>
                }
              />
              <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                {orderInfo.data.items.map((item, index) => (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 16,
                      backgroundColor: "#F9FAFB",
                      borderRadius: 14,
                      marginBottom:
                        index < orderInfo.data.items.length - 1 ? 10 : 0,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#111827",
                          marginBottom: 4,
                        }}
                      >
                        {item.product_name}
                      </Text>
                      <Text style={{ fontSize: 14, color: "#6B7280" }}>
                        {item.size} {item.unit}
                      </Text>
                      {item.notes && (
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#9CA3AF",
                            marginTop: 4,
                          }}
                        >
                          📝 {item.notes}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        backgroundColor: "#DBEAFE",
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: "#1D4ED8",
                        }}
                      >
                        x{item.quantity}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            {/* Acciones Rápidas */}
            <View style={{ paddingHorizontal: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: 14,
                }}
              >
                Acciones rápidas
              </Text>

              <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    icon="call"
                    text="Llamar"
                    variant="primary"
                    fullWidth
                    href={`tel:${orderInfo.data.customer_phone}`}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    icon="logo-whatsapp"
                    text="WhatsApp"
                    variant="whatsapp"
                    fullWidth
                    onPress={() =>
                      Linking.openURL(
                        `https://wa.me/${orderInfo.data.customer_phone}`,
                      )
                    }
                  />
                </View>
              </View>

              <Button
                icon="navigate"
                variant="secondary"
                text="Ver en Maps"
                fullWidth
                onPress={handleGoToLocation}
              />

              {/* Botón de entrega */}
              {orderInfo.data.order_status !== "entregado" && (
                <View style={{ marginTop: 20 }}>
                  <Button
                    onPress={handleMarkAsDelivered}
                    variant="success"
                    icon="checkmark-circle"
                    text="Marcar como Entregado"
                    fullWidth
                    size="lg"
                  />
                </View>
              )}
            </View>
          </ScrollView>

          {/* Loading overlay */}
          {(isPending || isLoadingLocation) && (
            <Loading
              variant="overlay"
              title={
                isLoadingLocation
                  ? "Guardando ubicación"
                  : "Actualizando estado"
              }
              message={
                isLoadingLocation
                  ? "Por favor, espera..."
                  : "Por favor, espera..."
              }
            />
          )}
        </>
      )}

      {isSheetOpen && (
        <Animated.View
          style={{
            opacity,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
      )}

      {isSheetOpen && (
        <OrderStatusBottomSheet
          ref={bottomSheetRef}
          orderStatusArray={orderInfo.data.status_history || []}
          onClose={handleCloseSheet}
        />
      )}
    </View>
  );
}
