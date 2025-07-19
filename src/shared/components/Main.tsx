import {
  FlatList,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { AnimatedOrderCard } from "../../features/orders/components/OrderCard";
import ScreenLayout from "@/shared/components/ScreenLayout";
import { useOrdersWithNotifications } from "@/features/orders/hooks/useOrdersWithNotifications";
import { useOrderFilters } from "@/features/orders/hooks/useOrderFilters";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/shared/components/Loading";
import {
  ActiveFilters,
  OrderFilters,
} from "@/features/orders/components/filters";

export default function Main() {
  const {
    uiState,
    serverFilters,
    activeFiltersCount,
    updateSearchQuery,
    executeSearch,
    updateStatus,
    updateDateRange,
    updateSort,
    resetFilters,
  } = useOrderFilters();

  const {
    data: orders,
    isLoading,
    refetch,
    isError,
  } = useOrdersWithNotifications({
    filters: serverFilters,
  });

  // const sheetRef = useRef<BottomSheet>(null);

  // // callbacks
  // const handleSheetChange = useCallback((index) => {
  //   console.log("handleSheetChange", index);
  // }, []);
  // const handleClosePress = useCallback(() => {
  //   sheetRef.current?.close();
  // }, []);
  // const handleOpenPress = useCallback(() => {
  //   sheetRef.current?.expand();
  // }, []);

  const renderEmptyState = () => {
    const hasFilters = activeFiltersCount > 0;

    return (
      <View className="items-center justify-center flex-1 px-6">
        <Ionicons
          name={hasFilters ? "filter-outline" : "receipt-outline"}
          size={64}
          color="#9CA3AF"
        />
        <Text className="mt-4 text-xl font-semibold text-gray-700">
          {hasFilters ? "No hay pedidos con estos filtros" : "No hay pedidos"}
        </Text>
        <Text className="mt-2 text-center text-gray-500">
          {hasFilters
            ? "Intenta cambiar los filtros para ver más pedidos"
            : "Los pedidos aparecerán aquí cuando los clientes realicen compras"}
        </Text>
        {hasFilters && (
          <TouchableOpacity
            className="flex-row items-center px-6 py-3 mt-6 bg-blue-500 rounded-full"
            onPress={resetFilters}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="ml-2 font-medium text-white">Limpiar filtros</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScreenLayout>
      <View className="mb-4">
        <View className="flex-row justify-between px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900">Pedidos</Text>
          <Text className="mt-1 text-sm text-gray-600">
            {orders?.data?.length || 0} pedidos
          </Text>
          {/* <Button
            variant="ghost"
            icon="filter"
            onPress={() => handleOpenPress()}
          /> */}
        </View>
        <OrderFilters
          searchQuery={uiState.searchQuery}
          selectedStatus={uiState.selectedStatus}
          dateRange={uiState.dateRange}
          sortBy={uiState.sortBy}
          sortOrder={uiState.sortOrder}
          activeFiltersCount={activeFiltersCount}
          onUpdateSearchQuery={updateSearchQuery}
          onExecuteSearch={executeSearch}
          onUpdateStatus={updateStatus}
          onUpdateDateRange={updateDateRange}
          onUpdateSort={updateSort}
          onResetFilters={resetFilters}
        />
        <ActiveFilters
          searchQuery={uiState.searchQuery}
          searchTerm={uiState.searchTerm}
          selectedStatus={uiState.selectedStatus}
          dateRange={uiState.dateRange}
          onUpdateSearchQuery={updateSearchQuery}
          onExecuteSearch={executeSearch}
          onUpdateStatus={updateStatus}
          onUpdateDateRange={updateDateRange}
          onResetFilters={resetFilters}
        />
      </View>

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
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          ListEmptyComponent={renderEmptyState}
        />
      )}
      {/* <BottomSheet
        ref={sheetRef}
        snapPoints={["50%"]}
        enablePanDownToClose={true}
        index={-1}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        backgroundStyle={{
          borderColor: "#E5E7EB",
          shadowColor: "#000",
          borderWidth: 2,
          borderRadius: 24,
        }}
      >
        <BottomSheetView className="flex-1">
          <View className="flex-row justify-between px-4 py-6">
            <View>
              <Text className="text-xl font-bold text-gray-900">Filtros</Text>
              <Text className="mt-2 text-sm text-gray-500">
                Ajusta los filtros para personalizar la lista de pedidos
              </Text>
            </View>
            <View>
              <Button
                variant="secondary"
                icon="close"
                onPress={handleClosePress}
              />
            </View>
          </View>
        </BottomSheetView>zz

         
      </BottomSheet> */}
    </ScreenLayout>
  );
}
