import { useLastOrders } from "@/features/orders/hooks/useOrders";
import ScreenLayout from "@/shared/components/ScreenLayout";
import { Text, View, FlatList, RefreshControl } from "react-native";
import OrderCard from "@/features/orders/components/OrderCard";
import Loading from "@/shared/components/Loading";
import OrdersError from "@/features/orders/components/OrdersError";

export default function History() {
  const { data: orders, isLoading, refetch, isError } = useLastOrders();
  return (
    <ScreenLayout>
      <View className={`mb-4`}>
        <View className="flex-row justify-between px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900">Pedidos</Text>
          <Text className="mt-1 text-sm text-gray-600">Últimos 10 pedidos</Text>
        </View>
      </View>

      {isLoading && !isError ? (
        <Loading
          title="Cargando historial"
          message="Se están cargando los últimos pedidos"
        />
      ) : isError ? (
        <OrdersError refetch={refetch} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders?.data || []}
          keyExtractor={(item) => item.tracking_code}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={["#3B82F6"]}
            />
          }
        />
      )}
    </ScreenLayout>
  );
}
