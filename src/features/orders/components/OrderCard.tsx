"use client";

import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import formatDate from "@/shared/utils/format-date";

export default function OrderCard({ order }) {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "pendiente":
        return "time-outline";
      case "processing":
      case "procesando":
        return "sync-outline";
      case "shipped":
      case "enviado":
        return "car-outline";
      case "delivered":
      case "entregado":
        return "checkmark-circle-outline";
      case "cancelled":
      case "cancelado":
        return "close-circle-outline";
      default:
        return "receipt-outline";
    }
  };

  return (
    <Link href={`/${order.tracking_code}`} asChild>
      <Pressable className="active:opacity-70">
        <View className="mx-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
          {/* Header con nombre del cliente */}
          <View className="flex-row items-center justify-between p-4 pb-3">
            <View className="flex-1">
              <Text
                className="text-lg font-semibold text-gray-900"
                numberOfLines={1}
              >
                {order.customer_name}
              </Text>
              <Text className="mt-1 text-sm text-gray-500">
                #{order.tracking_code}
              </Text>
            </View>
            <View className="ml-3">
              <OrderStatusBadge status={order.order_status} />
            </View>
          </View>

          {/* Separador sutil */}
          <View className="h-px mx-4 bg-gray-100" />

          {/* Footer con fecha e icono */}
          <View className="flex-row items-center justify-between p-4 pt-3">
            <View className="flex-row items-center flex-1">
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text className="ml-2 text-sm text-gray-600">
                {formatDate(order.order_date)}
              </Text>
            </View>
            <View className="flex-row items-center ml-3">
              <Ionicons
                name={getStatusIcon(order.order_status)}
                size={16}
                color="#6B7280"
              />
              <Ionicons
                name="chevron-forward"
                size={16}
                color="#9CA3AF"
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export function AnimatedOrderCard({ order, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <OrderCard order={order} />
    </Animated.View>
  );
}
