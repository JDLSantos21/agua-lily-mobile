"use client";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Pressable,
  Alert,
} from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import { Ionicons } from "@expo/vector-icons";
import OrderStatusBottomSheet from "@/components/OrderStatusBottomSheet";
import formatPhoneNumber from "@/shared/utils/format-number";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOrderByCode, useUpdateOrderStatus } from "@/hooks/useOrders";
import formatOrderDate from "@/shared/utils/format-order-date";
import Loading from "@/shared/components/Loading";

dayjs.locale(es); // Configurar el locale a español

export default function OrderDetails() {
  const { tracking_code } = useLocalSearchParams();
  const trackingCode = Array.isArray(tracking_code)
    ? tracking_code[0]
    : tracking_code;
  const bottomSheetRef = useRef(null);
  const { data: orderInfo, isLoading, isError } = useOrderByCode(trackingCode);

  const { mutateAsync: updateOrderStatus, isPending } =
    useUpdateOrderStatus(trackingCode);

  const insets = useSafeAreaInsets();

  const openInMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const openStatusHistory = () => {
    bottomSheetRef.current?.open();
  };

  const handleMarkAsDelivered = () => {
    Alert.alert(
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

              Alert.alert(
                "Éxito",
                "El pedido ha sido marcado como entregado correctamente."
              );
            } catch (error) {
              console.log("Error al marcar como entregado:", error);
              Alert.alert(
                "Error",
                "No se pudo marcar el pedido como entregado. Inténtalo más tarde."
              );
            }
          },
        },
      ]
    );
  };

  const InfoCard = ({ children, title, icon }) => (
    <View className="mx-4 mb-4 bg-white shadow-sm rounded-2xl">
      <View className="flex-row items-center p-4 pb-3 border-b border-gray-50">
        <Ionicons name={icon} size={20} color="#3B82F6" />
        <Text className="ml-3 text-lg font-semibold text-gray-900">
          {title}
        </Text>
      </View>
      <View className="p-4 pt-3">{children}</View>
    </View>
  );

  const ActionButton = ({
    onPress,
    icon,
    text,
    variant = "primary",
    href,
  }: {
    onPress?: () => void;
    icon: "call" | "map" | "logo-whatsapp";
    text: string;
    variant?: "primary" | "success" | "secondary" | "whatsapp";
    href?: string;
  }) => {
    const baseClasses =
      "flex-row items-center justify-center px-6 py-3 rounded-full flex-1 mx-1";
    const variants = {
      primary: "bg-blue-500",
      success: "bg-green-500",
      secondary: "bg-gray-100",
      whatsapp: "bg-green-600",
    };

    const textVariants = {
      primary: "text-white font-medium",
      success: "text-white font-medium",
      secondary: "text-gray-700 font-medium",
      whatsapp: "text-white font-medium",
    };

    const button = (
      <TouchableOpacity
        onPress={onPress}
        className={`${baseClasses} ${variants[variant]}`}
        activeOpacity={0.8}
      >
        <Ionicons
          name={icon}
          size={16}
          color={variant === "secondary" ? "#374151" : "white"}
        />
        <Text className={`ml-2 text-sm ${textVariants[variant]}`}>{text}</Text>
      </TouchableOpacity>
    );

    return href ? (
      <Link href={href} asChild>
        {button}
      </Link>
    ) : (
      button
    );
  };

  return (
    <View
      style={{ flex: 1, paddingBottom: insets.bottom }}
      className="bg-gray-50"
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: `#${tracking_code}`,
          headerTitleStyle: {
            color: "#1F2937",
            fontSize: 18,
            fontWeight: "600",
          },
          headerTintColor: "#3B82F6",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerShadowVisible: true,
        }}
      />

      {isLoading ? (
        <Loading
          title="Cargando detalles"
          message="Obteniendo información del pedido ..."
        />
      ) : isError ? (
        <View className="items-center justify-center flex-1 px-6">
          <View className="items-center p-8 bg-white shadow-sm rounded-2xl">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="mt-4 text-lg font-semibold text-gray-700">
              Ocurrió un problema
            </Text>
            <Text className="mt-2 text-center text-gray-500">
              No se pudo encontrar el pedido #{tracking_code}
            </Text>
          </View>
        </View>
      ) : !orderInfo?.data ? (
        <View className="items-center justify-center flex-1 px-6">
          <View className="items-center p-8 bg-white shadow-sm rounded-2xl">
            <Ionicons name="document-outline" size={48} color="#9CA3AF" />
            <Text className="mt-4 text-lg font-semibold text-gray-700">
              Pedido no encontrado
            </Text>
            <Text className="mt-2 text-center text-gray-500">
              El pedido #{tracking_code} no existe en el sistema
            </Text>
          </View>
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Header con estado y fecha */}
            <View className="flex-row items-center justify-between mx-4 mt-4 mb-6">
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Fecha del pedido</Text>
                <Text className="mt-1 text-base font-medium text-gray-900">
                  {formatOrderDate(orderInfo.data.created_at)}
                </Text>
              </View>
              <Pressable onPress={openStatusHistory} className="ml-4">
                <OrderStatusBadge status={orderInfo.data.order_status} />
              </Pressable>
            </View>

            {/* Información del Cliente */}
            <InfoCard title="Cliente" icon="person-outline">
              <View>
                <View className="mb-2">
                  <Text className="text-lg font-semibold text-gray-900">
                    {orderInfo.data.customer_name}
                  </Text>
                </View>

                <View className="flex-row items-center mb-1">
                  <Ionicons name="call-outline" size={16} color="#6B7280" />
                  <Text className="ml-3 text-gray-600">
                    {formatPhoneNumber(orderInfo.data.customer_phone)}
                  </Text>
                </View>

                <View className="flex-row items-start mb-1">
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="#6B7280"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="flex-1 ml-3 leading-5 text-gray-600">
                    {orderInfo.data.customer_address}
                  </Text>
                </View>
              </View>
            </InfoCard>

            {/* Productos */}
            <InfoCard title="Productos" icon="bag-outline">
              <View className="space-y-3">
                {orderInfo.data.items.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row items-start justify-between py-2"
                  >
                    <View className="flex-1 mr-4">
                      <Text className="font-medium text-gray-900">
                        {item.product_name}
                      </Text>
                      {item.notes && (
                        <Text className="mt-1 text-sm text-gray-500">
                          {item.notes}
                        </Text>
                      )}
                      <Text className="mt-1 text-sm text-gray-600">
                        {item.size} {item.unit}
                      </Text>
                    </View>
                    <View className="items-end">
                      <View className="px-3 py-1 rounded-full bg-blue-50">
                        <Text className="text-sm font-semibold text-blue-700">
                          x{item.quantity}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                <View className="pt-3 mt-3 border-t border-gray-100">
                  <Text className="text-sm text-gray-500">
                    Total de productos: {orderInfo.data.items.length}
                  </Text>
                </View>
              </View>
            </InfoCard>

            {/* Botones de acción */}
            <View className="mx-4 mb-6">
              <Text className="mb-3 text-base font-semibold text-gray-900">
                Acciones rápidas
              </Text>
              <View className="flex-row mb-3 space-x-2">
                <ActionButton
                  href={`tel:${orderInfo.data.customer_phone}`}
                  icon="call"
                  text="Llamar"
                  variant="primary"
                />
                <ActionButton
                  href={`https://wa.me/${orderInfo.data.customer_phone.replace(/\D/g, "")}`}
                  icon="logo-whatsapp"
                  text="WhatsApp"
                  variant="whatsapp"
                />
              </View>
              <View className="flex-row">
                <ActionButton
                  onPress={() => openInMaps(orderInfo.data.customer_address)}
                  icon="map"
                  text="Ver en mapa"
                  variant="secondary"
                />
              </View>
            </View>

            {/* Botón principal */}
            {orderInfo.data.order_status !== "entregado" && (
              <View className="mx-4">
                <TouchableOpacity
                  onPress={handleMarkAsDelivered}
                  className="flex-row items-center justify-center py-4 bg-green-500 shadow-sm rounded-2xl"
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text className="ml-2 text-lg font-semibold text-white">
                    Marcar como entregado
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Loading overlay - fuera del ScrollView para pantalla completa */}
          {isPending && (
            <View
              className="items-center justify-center bg-gray-100"
              style={{
                opacity: 0.9,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
              }}
            >
              <Loading
                title="Actualizando estado"
                message="Por favor, espera mientras se actualiza el estado del pedido..."
              />
            </View>
          )}
        </>
      )}

      {/* Bottom Sheet */}
      {orderInfo && (
        <OrderStatusBottomSheet
          ref={bottomSheetRef}
          orderStatusArray={orderInfo.data.status_history || []}
        />
      )}
    </View>
  );
}
