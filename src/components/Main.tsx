import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { AnimatedOrderCard } from "./OrderCard";
import ScreenLayout from "@/shared/components/ScreenLayout";
import { useOrders } from "@/hooks/useOrders";

export default function Main() {
  const { data: orders, isLoading, refetch } = useOrders();

  return (
    <ScreenLayout>
      {isLoading || !orders ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size={"large"} />
          <Text className="mt-2 text-center text-gray-500">
            Cargando pedidos...
          </Text>
        </View>
      ) : (
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={orders.data}
            keyExtractor={(order) => order.id.toString()}
            renderItem={({ item, index }) => (
              <AnimatedOrderCard order={item} index={index} />
            )}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          />
        </View>
      )}
    </ScreenLayout>
  );
}
