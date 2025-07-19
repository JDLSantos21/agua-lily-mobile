"use client";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { View, Text } from "react-native";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { Ionicons } from "@expo/vector-icons";
import type { OrderStatusHistory } from "@/types/orders.types";
import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import formatDate from "@/shared/utils/format-date";

type OrderStatusBottomSheetProps = {
  orderStatusArray: OrderStatusHistory[];
  onClose?: () => void;
};

export interface OrderStatusBottomSheetRef {
  open: () => void;
  close: () => void;
  expand: () => void;
  collapse: () => void;
}

const OrderStatusBottomSheet = forwardRef<
  OrderStatusBottomSheetRef,
  OrderStatusBottomSheetProps
>(({ orderStatusArray, onClose }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Exponer métodos para controlar el bottomsheet desde el componente padre
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.expand(),
    close: () => bottomSheetRef.current?.close(),
    expand: () => bottomSheetRef.current?.expand(),
    collapse: () => bottomSheetRef.current?.collapse(),
  }));

  const handleSheetChanges = (index: number) => {
    // Cuando el bottom sheet se cierra completamente (index = -1)
    if (index === -1 && onClose) {
      onClose();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "pendiente":
        return "time-outline";
      case "processing":
      case "preparando":
        return "sync-outline";
      case "shipped":
      case "despachado":
        return "car-outline";
      case "delivered":
      case "entregado":
        return "checkmark-circle-outline";
      case "cancelled":
      case "cancelado":
        return "close-circle-outline";
      default:
        return "ellipse-outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "pendiente":
        return "#F59E0B";
      case "processing":
      case "preparando":
        return "#3B82F6";
      case "shipped":
      case "despachado":
        return "#8B5CF6";
      case "delivered":
      case "entregado":
        return "#10B981";
      case "cancelled":
      case "cancelado":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const EmptyState = () => (
    <View className="items-center py-8">
      <View className="items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
        <Ionicons name="time-outline" size={32} color="#9CA3AF" />
      </View>
      <Text className="text-lg font-medium text-gray-700">Sin historial</Text>
      <Text className="mt-1 text-sm text-center text-gray-500">
        No hay estados registrados para este pedido
      </Text>
    </View>
  );

  const StatusItem = ({
    status,
    index,
    isLast,
  }: {
    status: OrderStatusHistory;
    index: number;
    isLast: boolean;
  }) => (
    <View className="relative">
      {/* Línea de conexión */}
      {!isLast && (
        <View className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200" />
      )}

      <View className="flex-row items-start p-4">
        {/* Icono de estado */}
        <View
          className="items-center justify-center w-20 h-20 p-2 rounded-full"
          style={{ backgroundColor: `${getStatusColor(status.status)}15` }}
        >
          <Ionicons
            name={getStatusIcon(status.status)}
            size={20}
            color={getStatusColor(status.status)}
          />
        </View>

        {/* Contenido */}
        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between mb-2">
            <OrderStatusBadge status={status.status} />
            <Text className="text-xs font-medium text-gray-500">
              {formatDate(status.created_at)}
            </Text>
          </View>

          {status.notes && (
            <Text className="text-sm leading-5 text-gray-600">
              {status.notes}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // -1 significa cerrado por defecto
      enablePanDownToClose={true}
      enableDynamicSizing={true}
      onChange={handleSheetChanges}
      backgroundStyle={{
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#D1D5DB",
        width: 40,
        height: 4,
      }}
      style={{
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="items-center justify-center w-10 h-10 mr-4 bg-blue-100 rounded-full">
            <Ionicons name="time-outline" size={20} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">
              Historial de Estados
            </Text>
            <Text className="text-sm text-gray-500">
              {orderStatusArray?.length || 0}{" "}
              {orderStatusArray?.length === 1 ? "estado" : "estados"}{" "}
              registrados
            </Text>
          </View>
        </View>
      </View>

      {/* Contenido */}
      {!orderStatusArray || orderStatusArray.length === 0 ? (
        <EmptyState />
      ) : (
        <BottomSheetFlatList
          data={orderStatusArray}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item, index }) => (
            <StatusItem
              status={item}
              index={index}
              isLast={index === orderStatusArray.length - 1}
            />
          )}
        />
      )}
    </BottomSheet>
  );
});

OrderStatusBottomSheet.displayName = "OrderStatusBottomSheet";

export default OrderStatusBottomSheet;
