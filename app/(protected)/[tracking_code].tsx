import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Pressable,
} from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { getOrderByCode } from "@/api/orders";
import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import { MapPin, User, Phone } from "lucide-react-native";
import OrderStatusBottomSheet from "@/components/OrderStatusBottomSheet";
import formatPhoneNumber from "@/shared/utils/format-number";
import { getCustomerByID } from "@/api/customers";
import { format } from "@formkit/tempo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderDetails() {
  const { tracking_code } = useLocalSearchParams();
  const [orderInfo, setOrderInfo] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const bottomSheetRef = useRef(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (tracking_code) {
      const code = Array.isArray(tracking_code)
        ? tracking_code[0]
        : tracking_code;
      getOrderByCode(code).then((data) => {
        if (data) {
          setOrderInfo(data);
          if (data.customer_id) {
            getCustomerByID(data.customer_id).then((customerData) => {
              if (customerData) {
                setCustomerInfo(customerData);
              } else {
                console.error(
                  "No se encontró el cliente con ID:",
                  data.customer_id
                );
              }
            });
          }
        } else {
          console.error("No se encontró el pedido con el código:", code);
        }
      });
    }
  }, [tracking_code]);

  const openInMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    Linking.openURL(url);
  };

  const openStatusHistory = () => {
    bottomSheetRef.current?.open();
  };

  return (
    <View
      style={{ flex: 1, paddingBottom: insets.bottom }}
      className="bg-white"
    >
      <Stack.Screen
        options={{
          title: `Pedido ${tracking_code}`,
          headerTitleStyle: { color: "#3B82F6" },
          headerTintColor: "#3B82F6",
          headerLeft: () => null,
          headerRight: () => <View className="w-10" />,
          headerTitle: Array.isArray(tracking_code)
            ? tracking_code[0]
            : tracking_code,
        }}
      />
      {orderInfo === null && customerInfo === null ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-500">
            Cargando detalles del pedido...
          </Text>
        </View>
      ) : (
        <ScrollView className="bg-gray-50">
          {/* Encabezado */}
          <View className="flex-row items-center justify-between mx-4 mt-4">
            <Text className="text-lg text-gray-600">
              {format(
                orderInfo.order_date,
                {
                  date: "long",
                  time: "short",
                },
                "es-DO"
              )}
            </Text>
            <Pressable onPress={openStatusHistory}>
              <OrderStatusBadge status={orderInfo.order_status} />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-2 mx-4 mb-8"></View>

          {/* Cliente */}
          <View className="p-4 mb-2 space-y-2 bg-white">
            <View className="flex-row items-center gap-2 mb-4">
              <User size={24} color="black" />
              <Text className="text-lg font-bold">Información del Cliente</Text>
            </View>

            <View className="gap-2 pl-8">
              <Text className="font-semibold text-gray-800">
                {orderInfo.customer_name}
              </Text>
              {/* telefono */}
              <View className="flex-row items-center gap-2">
                <Phone size={16} color="#6B7280" />
                <Text className="text-gray-600">
                  {formatPhoneNumber(orderInfo.customer_phone)}
                </Text>
              </View>

              {/* direccion */}
              <View className="flex-row items-center gap-2">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-gray-600">
                  {orderInfo.customer_address}
                </Text>
              </View>
            </View>
          </View>

          {/* Detalles de entrega */}
          {/* <View className="p-4">
            {orderInfo.driver_name && (
              <View className="flex-row items-center gap-2">
                <Truck size={18} color="#6B7280" />
                <Text className="text-gray-700">
                  Entregado por: {orderInfo.driver_name} (
                  {orderInfo.vehicle_tag})
                </Text>
              </View>
            )}
          </View> */}

          {/* Productos */}
          <View className="px-4 space-y-2 bg-white shadow-sm">
            {/* Cabecera de productos */}
            <View className="flex-row items-center justify-between py-2 mb-2 border-b border-gray-400">
              <Text className="font-semibold text-gray-800">Productos</Text>
              <Text className="text-gray-600">{orderInfo.items.length}</Text>
            </View>
            {/* Lista de productos */}
            {orderInfo.items.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between py-2 border-b border-gray-200"
              >
                <View>
                  <Text className="text-gray-700">{item.product_name}</Text>
                  {item.notes && (
                    <Text className="text-sm text-gray-500">{item.notes}</Text>
                  )}
                </View>
                <View className="items-end">
                  <Text className="text-gray-600">
                    {item.size} {item.unit}
                  </Text>
                  <Text className="text-lg font-bold text-gray-800">
                    x{item.quantity}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Botones de contacto */}
          <View className="flex-row flex-wrap items-center gap-3 p-4 justify-evenly">
            <Link asChild href={`tel:${orderInfo.customer_phone}`}>
              <TouchableOpacity className="flex-row items-center gap-2 px-5 py-2.5 bg-blue-500 rounded-full">
                <Phone size={14} color="#fff" />
                <Text className="text-sm text-white">Llamar</Text>
              </TouchableOpacity>
            </Link>

            {/* whatsapp */}
            <Link
              asChild
              href={`https://wa.me/${orderInfo.customer_phone.replace(
                /\D/g,
                ""
              )}`}
            >
              <TouchableOpacity className="flex-row items-center gap-2 px-5 py-2.5 bg-green-500 rounded-full">
                <Text className="text-sm text-white">WhatsApp</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              onPress={() => openInMaps(orderInfo.customer_address)}
              className="flex-row items-center gap-2 px-5 py-2.5 bg-blue-100 rounded-full"
            >
              <MapPin size={14} color="#3B82F6" />
              <Text className="text-sm text-blue-600">Mapa</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => alert("Función no implementada")}
            className="w-3/4 py-5 mx-auto mt-10 mb-10 bg-green-500 rounded-lg px-7"
          >
            <Text className="text-lg text-center text-white ">
              Marcar como entregado
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {/* Solo renderizar el BottomSheet si orderInfo existe y tiene status_history */}
      {orderInfo && (
        <OrderStatusBottomSheet
          ref={bottomSheetRef}
          orderStatusArray={orderInfo.status_history || []}
        />
      )}
    </View>
  );
}
