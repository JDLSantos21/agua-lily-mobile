import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
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

dayjs.locale(es); // Configurar el locale a español

export default function OrderDetails() {
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

  const handleSnapPress = () => {
    bottomSheetRef.current?.open();
    setIsSheetOpen(true);
  };

  const handleSaveLocation = async () => {
    Alert.alert(
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
      { cancelable: true }
    );
  };

  const handleGoToLocation = () => {
    openInMaps(orderInfo.data.customer_address, {
      lat: orderInfo.data.coordinates_lat,
      lng: orderInfo.data.coordinates_lng,
    });
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
                "Ocurrió un problema",
                "No se pudo marcar el pedido como entregado. Inténtalo más tarde."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }} className="bg-gray-50">
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
        <OrderError orderId={trackingCode} />
      ) : !orderInfo.data ? (
        <OrderNotFound orderId={trackingCode} />
      ) : (
        <>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                colors={["#3B82F6"]}
              />
            }
          >
            {/* Status y Fecha - Diseño más destacado */}
            <View className="mx-4 mt-6 mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                    Pedido #{trackingCode}
                  </Text>
                  <Text className="mt-1 text-2xl font-bold text-gray-900">
                    {formatDate(orderInfo.data.created_at)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleSnapPress()}
                  activeOpacity={0.7}
                  className="ml-4"
                >
                  <OrderStatusBadge status={orderInfo.data.order_status} />
                </TouchableOpacity>
              </View>

              {/* Información adicional del pedido */}
              <View className="p-4 bg-white shadow-sm rounded-2xl">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-500">
                      Fecha de entrega
                    </Text>
                    <Text className="text-base font-semibold text-gray-900">
                      {formatDate(
                        orderInfo.data.scheduled_delivery_date,
                        "DD MMMM, YYYY"
                      )}
                    </Text>
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-sm font-medium text-gray-500">
                      Horario
                    </Text>
                    <Text className="text-base font-semibold text-gray-900">
                      {orderInfo.data.delivery_time_slot || "No especificado"}
                    </Text>
                  </View>
                </View>

                {orderInfo.data.delivery_notes && (
                  <View className="pt-3 border-t border-gray-100">
                    <Text className="mb-1 text-sm font-medium text-gray-500">
                      Notas de entrega
                    </Text>
                    <Text className="text-sm text-gray-700">
                      {orderInfo.data.delivery_notes}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Información del Cliente - Diseño más limpio */}
            <View className="mx-4 mb-6 bg-white shadow-sm rounded-3xl">
              <View className="p-6">
                <View className="flex-row items-center mb-5">
                  <View className="items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Ionicons name="person" size={20} color="#3B82F6" />
                  </View>
                  <Text className="ml-4 text-lg font-semibold text-gray-900">
                    Información del Cliente
                  </Text>
                </View>

                <View className="space-y-4">
                  <View>
                    <Text className="mb-1 text-2xl font-bold text-gray-900">
                      {orderInfo.data.customer_name}
                    </Text>
                  </View>

                  <View className="flex-row items-center px-4 py-3 mb-2 bg-gray-50 rounded-2xl">
                    <View className="items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <Ionicons name="call" size={16} color="#10B981" />
                    </View>
                    <Text className="ml-3 text-base font-medium text-gray-900">
                      {formatPhoneNumber(orderInfo.data.customer_phone)}
                    </Text>
                  </View>

                  <View className="flex-row items-start px-4 py-3 bg-gray-50 rounded-2xl">
                    <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mt-0.5">
                      <Ionicons name="location" size={16} color="#F59E0B" />
                    </View>
                    <Text className="flex-1 ml-3 text-base leading-6 text-gray-900">
                      {orderInfo.data.customer_address}
                    </Text>
                  </View>
                  {/* </TouchableOpacity> */}

                  {/* GPS Status y Acción */}
                  {orderInfo.data.customer_id && (
                    <View className="mt-3">
                      {orderInfo.data.coordinates_lat &&
                      orderInfo.data.coordinates_lng ? (
                        <View className="p-4 bg-green-50 rounded-2xl">
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                              <View className="flex-row items-center mb-2">
                                <Ionicons
                                  name="checkmark-circle"
                                  size={18}
                                  color="#10B981"
                                />
                                <Text className="ml-2 text-sm font-medium text-green-700">
                                  Ubicación GPS guardada
                                </Text>
                              </View>
                              <Text className="text-xs text-green-600">
                                Guardado:{" "}
                                {formatDate(
                                  orderInfo.data.coordinates_saved_at
                                )}
                              </Text>
                            </View>

                            <Button
                              onPress={handleSaveLocation}
                              variant="success"
                              icon="refresh"
                              disabled={isLoadingLocation}
                              className="rounded-full"
                              pressedOpacity={0.5}
                            />
                          </View>
                        </View>
                      ) : (
                        <View className="p-4 border border-yellow-200 bg-yellow-50 rounded-2xl">
                          <View className="flex-row items-start">
                            <Ionicons
                              name="warning"
                              size={20}
                              color="#F59E0B"
                            />
                            <View className="flex-1 ml-3">
                              <Text className="mb-1 text-sm font-medium text-yellow-800">
                                Ubicación GPS no guardada
                              </Text>
                              <Text className="mb-3 text-xs text-yellow-700">
                                Para entregas más precisas, guarda la ubicación
                                GPS exacta del cliente
                              </Text>
                              <Button
                                onPress={handleSaveLocation}
                                variant="location"
                                text="Establecer ubicación actual"
                                icon="location"
                                disabled={isLoadingLocation}
                                className="rounded-full"
                              />
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Información Adicional - Solo si hay datos relevantes */}
            {(orderInfo.data.notes ||
              orderInfo.data.driver_name ||
              orderInfo.data.vehicle_tag) && (
              <View className="mx-4 mb-6 bg-white shadow-sm rounded-3xl">
                <View className="p-6">
                  <View className="flex-row items-center mb-5">
                    <View className="items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Ionicons
                        name="information-circle"
                        size={20}
                        color="#2563EB"
                      />
                    </View>
                    <Text className="ml-4 text-lg font-semibold text-gray-900">
                      Información Adicional
                    </Text>
                  </View>

                  <View className="space-y-4">
                    {orderInfo.data.driver_name && (
                      <View className="flex-row items-center p-3 mb-2 rounded-2xl">
                        <Ionicons
                          name="person-circle"
                          size={20}
                          color="#3B82F6"
                        />
                        <View className="ml-3">
                          <Text className="text-sm font-medium ">
                            Conductor asignado
                          </Text>
                          <Text className="text-sm ">
                            {orderInfo.data.driver_name}
                          </Text>
                        </View>
                      </View>
                    )}

                    {orderInfo.data.vehicle_tag && (
                      <View className="flex-row items-center p-3 mb-2 rounded-2xl">
                        <Ionicons name="car" size={20} color="#8B5CF6" />
                        <View className="ml-3">
                          <Text className="text-sm font-medium ">Vehículo</Text>
                          <Text className="text-sm ">
                            {orderInfo.data.vehicle_tag}
                          </Text>
                        </View>
                      </View>
                    )}

                    {orderInfo.data.notes && (
                      <View className="p-3 bg-gray-50 rounded-2xl">
                        <Text className="mb-2 text-sm font-medium text-gray-800">
                          Notas del pedido
                        </Text>
                        <Text className="text-sm text-gray-700">
                          {orderInfo.data.notes}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* Productos - Diseño más visual */}
            <View className="mx-4 mb-6 bg-white shadow-sm rounded-3xl">
              <View className="p-6">
                <View className="flex-row items-center mb-5">
                  <View className="items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <Ionicons name="cart-sharp" size={20} color="#000000" />
                  </View>
                  <Text className="ml-4 text-lg font-semibold text-gray-900">
                    Productos
                  </Text>
                  <View className="px-3 py-1 ml-auto bg-gray-100 rounded-full">
                    <Text className="text-sm font-medium text-gray-600">
                      {orderInfo.data.items.length}{" "}
                      {orderInfo.data.items.length === 1
                        ? "producto"
                        : "productos"}
                    </Text>
                  </View>
                </View>

                <View className="space-y-4">
                  {orderInfo.data.items.map((item) => (
                    <View
                      key={item.id}
                      className="flex-row items-center justify-between p-4 mb-2 bg-gray-50 rounded-2xl"
                    >
                      <View className="flex-1">
                        <Text className="mb-1 text-base font-semibold text-gray-900">
                          {item.product_name}
                        </Text>
                        {item.notes && (
                          <Text className="mb-2 text-sm text-gray-500">
                            Nota: {item.notes}
                          </Text>
                        )}
                        <View className="flex-row items-center">
                          <Text className="text-sm font-medium text-gray-600">
                            {item.size} {item.unit}
                          </Text>
                        </View>
                      </View>
                      <View className="px-4 py-2 ml-4 bg-blue-100 rounded-full">
                        <Text className="text-base font-bold text-blue-700">
                          x{item.quantity}
                        </Text>
                      </View>
                    </View>
                  ))}

                  {/* Resumen de productos */}
                  {/* <View className="pt-4 mt-4 border-t border-gray-100">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-medium text-gray-600">
                        Total de items:
                      </Text>
                      <Text className="text-sm font-bold text-gray-900">
                        {orderInfo.data.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}{" "}
                        unidades
                      </Text>
                    </View>
                  </View> */}
                </View>
              </View>
            </View>

            {/* Acciones Rápidas - Diseño más intuitivo */}
            <View className="mx-4 mb-6">
              <Text className="mb-4 text-lg font-semibold text-gray-900">
                Acciones Rápidas
              </Text>
              <View className="flex-row gap-2 mb-3">
                <Button
                  icon="call"
                  text="Llamar"
                  variant="primary"
                  className="flex-1"
                  href={`tel:${orderInfo.data.customer_phone}`}
                />

                <Button
                  icon="logo-whatsapp"
                  text="Whatsapp"
                  variant="whatsapp"
                  className="flex-1"
                  onPress={() =>
                    Linking.openURL(
                      `https://wa.me/${orderInfo.data.customer_phone}`
                    )
                  }
                />
              </View>
              <Button
                icon="navigate"
                variant="secondary"
                text="Ver en Maps"
                onPress={handleGoToLocation}
              />
            </View>

            {/* Botón Principal de Entrega */}
            {orderInfo.data.order_status !== "entregado" && (
              <View className="mx-4 mb-8">
                <Button
                  onPress={handleMarkAsDelivered}
                  variant="success"
                  icon="checkmark-circle"
                  text="Marcar como Entregado"
                />
              </View>
            )}
          </ScrollView>

          {/* Loading overlay - fuera del ScrollView para pantalla completa */}
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
                  ? "Por favor, espera mientras guardamos la ubicación GPS..."
                  : "Por favor, espera mientras se actualiza el estado del pedido..."
              }
            />
          )}
        </>
      )}

      {isSheetOpen && (
        <View className="absolute top-0 h-full w-[500px] bg-black/40" />
      )}

      {isSheetOpen && (
        <OrderStatusBottomSheet
          ref={bottomSheetRef}
          orderStatusArray={orderInfo.data.status_history || []}
          onClose={() => setIsSheetOpen(false)}
        />
      )}
    </View>
  );
}
