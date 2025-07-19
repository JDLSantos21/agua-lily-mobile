import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderStatus } from "@/types/orders.types";
import {
  DateRangeType,
  ORDER_STATUS_FILTERS,
  DATE_RANGE_FILTERS,
} from "@/types/filters.types";
import { memo, useMemo } from "react";

interface ActiveFiltersProps {
  searchQuery: string;
  searchTerm: string;
  selectedStatus: OrderStatus | undefined;
  dateRange: DateRangeType;
  onUpdateSearchQuery: (query: string) => void;
  onExecuteSearch: () => void;
  onUpdateStatus: (status: OrderStatus | undefined) => void;
  onUpdateDateRange: (dateRange: DateRangeType) => void;
  onResetFilters: () => void;
}

export default memo(function ActiveFilters({
  searchQuery,
  searchTerm,
  selectedStatus,
  dateRange,
  onUpdateSearchQuery,
  onExecuteSearch,
  onUpdateStatus,
  onUpdateDateRange,
  onResetFilters,
}: ActiveFiltersProps) {
  const activeFilters = useMemo(() => {
    const filters = [];

    // Filtro de estado
    if (selectedStatus) {
      const statusFilter = ORDER_STATUS_FILTERS.find(
        (f) => f.value === selectedStatus
      );
      if (statusFilter) {
        filters.push({
          key: "status",
          label: statusFilter.label,
          onRemove: () => onUpdateStatus(undefined),
        });
      }
    }

    // Filtro de fecha
    if (dateRange.type !== "all") {
      const dateFilter = DATE_RANGE_FILTERS.find(
        (f) => f.value === dateRange.type
      );
      if (dateFilter) {
        filters.push({
          key: "dateRange",
          label: dateFilter.label,
          onRemove: () => onUpdateDateRange({ type: "all" }),
        });
      }
    }

    // Filtro de búsqueda activa (searchTerm, no searchQuery)
    if (searchTerm.trim()) {
      filters.push({
        key: "searchTerm",
        label: `"${searchTerm}"`,
        onRemove: () => {
          onUpdateSearchQuery("");
          onExecuteSearch();
        },
      });
    }

    return filters;
  }, [
    selectedStatus,
    dateRange,
    searchTerm,
    onUpdateStatus,
    onUpdateDateRange,
    onUpdateSearchQuery,
    onExecuteSearch,
  ]);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <View className="px-4 py-2 border border-blue-200 bg-blue-50">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-medium text-blue-800">
          Filtros activos:
        </Text>
        <TouchableOpacity
          className="flex-row items-center px-2 py-1 bg-blue-200 rounded"
          onPress={onResetFilters}
        >
          <Ionicons name="close" size={14} color="#1E40AF" />
          <Text className="ml-1 text-xs font-medium text-blue-800">
            Limpiar todo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {activeFilters.map((filter) => (
            <View
              key={filter.key}
              className="flex-row items-center px-3 py-1 bg-blue-200 rounded-full"
            >
              <Text className="text-sm font-medium text-blue-800">
                {filter.label}
              </Text>
              <TouchableOpacity className="p-1 ml-2" onPress={filter.onRemove}>
                <Ionicons name="close" size={14} color="#1E40AF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
});
