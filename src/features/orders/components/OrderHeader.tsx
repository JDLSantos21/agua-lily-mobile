import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import formatDate from "@/shared/utils/format-date";
import { Pressable, Text, View, StyleProp, ViewStyle } from "react-native";

interface OrderHeaderProps {
  created_at: string;
  orderStatus: string;
  onStatusPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function OrderHeader({
  created_at,
  orderStatus,
  onStatusPress,
  style,
}: OrderHeaderProps) {
  return (
    <View
      className="flex-row items-center justify-between mx-4 mt-4 mb-6"
      style={style}
    >
      <View className="flex-1">
        <Text className="text-sm text-gray-500">Fecha del pedido</Text>
        <Text className="mt-1 text-base font-medium text-gray-900">
          {formatDate(created_at)}
        </Text>
      </View>
      <Pressable onPress={onStatusPress} className="ml-4">
        <OrderStatusBadge status={orderStatus} />
      </Pressable>
    </View>
  );
}
