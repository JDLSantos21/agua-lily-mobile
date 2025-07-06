import {
  FlatList,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { AnimatedOrderCard } from "./OrderCard";
import ScreenLayout from "@/shared/components/ScreenLayout";
import { useOrders } from "@/hooks/useOrders";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/shared/components/Loading";

export default function Main() {
  const { data: orders, isLoading, refetch, isError } = useOrders();

  const renderEmptyState = () => (
    <View className="items-center justify-center flex-1 px-6">
      <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
      <Text className="mt-4 text-xl font-semibold text-gray-700">
        No hay pedidos
      </Text>
      <Text className="mt-2 text-center text-gray-500">
        Los pedidos aparecerán aquí cuando los clientes realicen compras
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View className="flex-row justify-between px-4 pt-4 pb-4">
      <Text className="text-2xl font-bold text-gray-900">Pedidos</Text>
      <Text className="mt-1 text-sm text-gray-600">
        {orders?.data?.length || 0} pedidos en total
      </Text>
    </View>
  );

  return (
    <ScreenLayout>
      {isLoading && !isError ? (
        <Loading
          title="Cargando pedidos"
          message="Esto solo tomará un momento..."
        />
      ) : isError ? (
        <View className="items-center justify-center flex-1 px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="mt-4 text-xl font-semibold text-gray-700">
            Ocurrió un problema
          </Text>
          <Text className="mt-2 text-center text-gray-500">
            No pudimos cargar los pedidos. Verifica tu conexión e intenta
            nuevamente.
          </Text>
          <TouchableOpacity
            className="flex-row items-center px-6 py-3 mt-6 bg-blue-500 rounded-full"
            onPress={() => refetch()}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="ml-2 font-medium text-white">Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders?.data || []}
          keyExtractor={(order) => order.id.toString()}
          renderItem={({ item, index }) => (
            <AnimatedOrderCard order={item} index={index} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={["#3B82F6"]}
              // tintColor="#3B82F6"
            />
          }
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
      )}
    </ScreenLayout>
  );
}
