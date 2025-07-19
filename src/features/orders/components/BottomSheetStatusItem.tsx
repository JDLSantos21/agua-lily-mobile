import { OrderStatusHistory } from "@/types/orders.types";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  getStatusColor,
  getStatusIcon,
} from "../utils/StatusBottomSheetStyles";

import OrderStatusBadge from "@/shared/components/OrderStatusBadge";
import formatDate from "@/shared/utils/format-date";

export const BottomSheetStatusItem = ({
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
        className="items-center justify-center w-10 h-10 p-2 rounded-full"
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
