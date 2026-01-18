"use client";

import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import formatDate from "@/shared/utils/format-date";
import * as Haptics from "expo-haptics";
import { OrderStatus } from "@/types/orders.types";

interface Order {
  id: number;
  tracking_code: string;
  customer_name: string;
  order_status: OrderStatus;
  order_date: string;
  shipping_address?: string;
  scheduled_delivery_date?: string;
}

export default function OrderCard({ order }: { order: Order }) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Link href={`/${order.tracking_code}`} asChild>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        })}
        accessibilityLabel={`Pedido de ${order.customer_name}, código ${order.tracking_code}`}
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
            marginHorizontal: 2, // Slight margin to prevent shadow clipping if too tight
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Header: Cliente y Status */}
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
                  numberOfLines={1}
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {order.customer_name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#9CA3AF",
                    marginTop: 2,
                  }}
                >
                  #{order.tracking_code}
                </Text>
              </View>
              <OrderStatusBadge status={order.order_status} size="sm" />
            </View>

            {/* Dirección si existe */}
            {order.shipping_address && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 14,
                  paddingBottom: 10,
                }}
              >
                <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    marginLeft: 6,
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                >
                  {order.shipping_address}
                </Text>
              </View>
            )}

            {/* Footer: Fecha y chevron solamente */}
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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                >
                  {formatDate(order.order_date)}
                </Text>
              </View>

              {/* Solo chevron, sin texto */}
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export function AnimatedOrderCard({
  order,
  index,
}: {
  order: Order;
  index: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        delay: index * 40,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        delay: index * 40,
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
