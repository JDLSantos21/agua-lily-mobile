import { useLastOrders } from "@/features/orders/hooks/useOrders";
// import ScreenLayout from "@/shared/components/ScreenLayout";
import { Text, View, FlatList, RefreshControl } from "react-native";
import OrderCard from "@/features/orders/components/OrderCard";
import Loading from "@/shared/components/Loading";
import OrdersError from "@/features/orders/components/OrdersError";

export default function History() {
  const { data: orders, isLoading, refetch, isError } = useLastOrders();
  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View className={`mb-4`}>
        <View className="flex-row justify-between pt-4 pb-2 px-3">
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
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 12 }}>
              <OrderCard order={item} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={["#3B82F6"]}
            />
          }
        />
      )}
    </View>
  );
}
