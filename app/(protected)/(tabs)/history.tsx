import { useLastOrders } from "@/features/orders/hooks/useOrders";
import ScreenLayout from "@/shared/components/ScreenLayout";
import { Text, View, FlatList, RefreshControl } from "react-native";
import OrderCard from "@/features/orders/components/OrderCard";
import Loading from "@/shared/components/Loading";
import OrdersError from "@/features/orders/components/OrdersError";
import { Ionicons } from "@expo/vector-icons";

export default function History() {
  const { data: orders, isLoading, refetch, isError } = useLastOrders();
  return (
    <ScreenLayout>
      {/* Header */}
      <View className="px-4 pt-6 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">Historial</Text>
            <Text className="mt-1 text-sm text-gray-500">
              Últimos 10 pedidos completados
            </Text>
          </View>
          <View className="items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <Ionicons name="reload-outline" size={20} color="#3B82F6" />
          </View>
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
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 20,
          }}
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
