import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import { format } from "@formkit/tempo";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

export default function OrderCard({ order }) {
  return (
    <Link href={`/${order.tracking_code}`} asChild>
      <Pressable>
        <View className="flex-row items-center p-5 my-1 border border-gray-300 bg-slate-50 rounded-xl">
          <View>
            <Text className="text-xl font-semibold">{order.customer_name}</Text>
            <Text className="text-sm text-gray-500">
              {format(
                order.order_date,
                { date: "long", time: "short" },
                "es-DO"
              )}
            </Text>
            <Text className="text-sm text-gray-500">{order.tracking_code}</Text>
          </View>
          <View className="h-full ml-auto ">
            <OrderStatusBadge status={order.order_status} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export function AnimatedOrderCard({ order, index }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [index, opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <OrderCard order={order} />
    </Animated.View>
  );
}
