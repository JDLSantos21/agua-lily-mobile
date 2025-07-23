import {
  FlatList,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  // Animated,
} from "react-native";
import { AnimatedOrderCard } from "../../features/orders/components/OrderCard";
import ScreenLayout from "@/shared/components/ScreenLayout";
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useOrderFilters } from "@/features/orders/hooks/useOrderFilters";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/shared/components/Loading";
import {
  ActiveFilters,
  OrderFilters,
} from "@/features/orders/components/filters";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import Button from "./ui/Button";
import OrdersError from "@/features/orders/components/OrdersError";
import { useOrders } from "@/features/orders/hooks/useOrders";

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const {
    data: orders,
    isLoading,
    refetch,
    isError,
  } = useOrders(serverFilters);

  const opacity = useSharedValue(0);

  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["80%"], []);

  const handleSnapPress = (index: number) => {
    sheetRef.current?.snapToIndex(index);
    setIsSheetOpen(true);
    opacity.value = withTiming(1, { duration: 300 });
  };

  const handleCloseSheet = () => {
    opacity.value = withTiming(0, { duration: 200 }, () =>
      runOnJS(setIsSheetOpen)(false)
    );
  };

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
      <View className={`mb-4`}>
        <View className="flex-row justify-between px-4 pt-4 pb-2">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Pedidos</Text>
            <Text className="mt-1 text-sm text-gray-600">
              {orders?.data?.length || 0} pedidos
            </Text>
          </View>
          <Button
            iconColor={activeFiltersCount > 0 ? "#2196f3" : "#333"}
            variant="ghost"
            icon="filter"
            onPress={() => handleSnapPress(0)}
          />
        </View>
      </View>

      {isLoading && !isError ? (
        <Loading
          title="Cargando pedidos"
          message="Esto solo tomará un momento..."
        />
      ) : isError ? (
        <OrdersError refetch={refetch} />
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
      {isSheetOpen && (
        <Animated.View
          pointerEvents="auto"
          style={{
            opacity,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          className="absolute top-0 h-full w-[500px]"
        />
      )}
      {isSheetOpen && (
        <BottomSheet
          ref={sheetRef}
          enablePanDownToClose
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          onClose={() => handleCloseSheet()}
        >
          <BottomSheetScrollView>
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
          </BottomSheetScrollView>
        </BottomSheet>
      )}
    </ScreenLayout>
  );
}
