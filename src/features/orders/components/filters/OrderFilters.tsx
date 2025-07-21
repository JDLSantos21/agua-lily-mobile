import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { OrderStatus } from "@/types/orders.types";
import {
  DateRangeType,
  ORDER_STATUS_FILTERS,
  DATE_RANGE_FILTERS,
  SORT_OPTIONS,
} from "@/types/filters.types";

interface OrderFiltersProps {
  searchQuery: string;
  selectedStatus: OrderStatus | undefined;
  dateRange: DateRangeType;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  activeFiltersCount: number;
  onUpdateSearchQuery: (query: string) => void;
  onExecuteSearch: () => void;
  onUpdateStatus: (status: OrderStatus | undefined) => void;
  onUpdateDateRange: (dateRange: DateRangeType) => void;
  onUpdateSort: (sortBy: string, sortOrder: "ASC" | "DESC") => void;
  onResetFilters: () => void;
}

export default memo(function OrderFiltersComponent({
  searchQuery,
  selectedStatus,
  dateRange,
  sortBy,
  sortOrder,
  activeFiltersCount,
  onUpdateSearchQuery,
  onExecuteSearch,
  onUpdateStatus,
  onUpdateDateRange,
  onUpdateSort,
  onResetFilters,
}: OrderFiltersProps) {
  // const [showFiltersModal, setShowFiltersModal] = useState(false);
  // const [showSortModal, setShowSortModal] = useState(false);

  const renderStatusFilter = () => (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-gray-900">Estado</Text>
      <ScrollView>
        <View className="flex-row flex-wrap gap-2">
          {ORDER_STATUS_FILTERS.map((option) => (
            <TouchableOpacity
              key={option.value || "all"}
              className={`flex-row items-center px-3 py-2 rounded-full border ${
                selectedStatus === option.value
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => onUpdateStatus(option.value)}
            >
              <Ionicons
                name={option.icon as any}
                size={16}
                color={selectedStatus === option.value ? "white" : "#6B7280"}
              />
              <Text
                className={`ml-2 text-sm font-medium ${
                  selectedStatus === option.value
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderDateRangeFilter = () => (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-gray-900">Fecha</Text>
      <View className="flex-row flex-wrap gap-2">
        {DATE_RANGE_FILTERS.map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`flex-row items-center px-3 py-2 rounded-full border ${
              dateRange.type === option.value
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
            }`}
            onPress={() => onUpdateDateRange({ type: option.value })}
          >
            <Ionicons
              name={option.icon as any}
              size={16}
              color={dateRange.type === option.value ? "white" : "#6B7280"}
            />
            <Text
              className={`ml-2 text-sm font-medium ${
                dateRange.type === option.value ? "text-white" : "text-gray-700"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSortOptions = () => (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-gray-900">
        Ordenar por
      </Text>
      {SORT_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.field}
          className={`flex-row items-center justify-between p-3 rounded-lg border mb-2 ${
            sortBy === option.field
              ? "bg-blue-50 border-blue-200"
              : "bg-white border-gray-200"
          }`}
          onPress={() => onUpdateSort(option.field, sortOrder)}
        >
          <Text
            className={`font-medium ${
              sortBy === option.field ? "text-blue-600" : "text-gray-700"
            }`}
          >
            {option.label}
          </Text>
          {sortBy === option.field && (
            <TouchableOpacity
              onPress={() =>
                onUpdateSort(option.field, sortOrder === "ASC" ? "DESC" : "ASC")
              }
            >
              <Ionicons
                name={sortOrder === "ASC" ? "arrow-up" : "arrow-down"}
                size={20}
                color="#2563EB"
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View className="bg-white">
      {/* Barra de búsqueda */}
      <View className="px-4 py-3">
        <View className="flex-row items-stretch overflow-hidden bg-white border border-gray-200 rounded-lg">
          <View className="flex-row items-center flex-1 px-3 py-2">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-2 text-gray-900"
              placeholder="Buscar por cliente, código o teléfono..."
              value={searchQuery}
              onChangeText={onUpdateSearchQuery}
              returnKeyType="search"
              onSubmitEditing={onExecuteSearch}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => onUpdateSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            className="items-center justify-center px-4 bg-blue-500"
            onPress={onExecuteSearch}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {activeFiltersCount > 0 && (
          <TouchableOpacity
            className="flex-row items-center justify-center px-3 py-2 mt-5 bg-red-100 rounded-lg w-44"
            onPress={onResetFilters}
          >
            <Ionicons name="refresh" size={16} color="#EF4444" />
            <Text className="ml-2 text-sm font-medium text-red-600">
              Limpiar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Botones de filtros */}
      {/* <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity
          className="flex-row items-center px-3 py-2 mr-3 bg-blue-500 rounded-lg"
          onPress={() => setShowFiltersModal(true)}
        >
          <Ionicons name="filter" size={16} color="white" />
          <Text className="ml-2 text-sm font-medium text-white">Filtros</Text>
          {activeFiltersCount > 0 && (
            <View className="items-center justify-center w-5 h-5 ml-2 bg-white rounded-full">
              <Text className="text-xs font-bold text-blue-500">
                {activeFiltersCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-3 py-2 mr-3 bg-gray-100 rounded-lg"
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="swap-vertical" size={16} color="#6B7280" />
          <Text className="ml-2 text-sm font-medium text-gray-700">
            Ordenar
          </Text>
        </TouchableOpacity>

       
      </View> */}

      {/* Modal de filtros */}
      {/* <Modal
        visible={showFiltersModal}
        animationType="slide"
        presentationStyle="pageSheet"
      > */}

      <View className="flex-1 bg-white">
        {/* <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Filtros</Text>
          <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View> */}

        <ScrollView className="flex-1 p-4">
          {renderStatusFilter()}
          {renderDateRangeFilter()}
        </ScrollView>

        {/* <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            className="py-3 bg-blue-500 rounded-lg"
            onPress={() => setShowFiltersModal(false)}
          >
            <Text className="font-semibold text-center text-white">
              Aplicar filtros
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
      {/* </Modal> */}

      {/* Modal de ordenamiento */}
      {/* <Modal
        visible={showSortModal}
        animationType="slide"
        presentationStyle="pageSheet"
      > */}
      <View className="flex-1 bg-white">
        {/* <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Ordenar</Text>
          <TouchableOpacity onPress={() => setShowSortModal(false)}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View> */}

        <ScrollView className="flex-1 p-4">{renderSortOptions()}</ScrollView>

        {/* <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            className="py-3 bg-blue-500 rounded-lg"
            onPress={() => setShowSortModal(false)}
          >
            <Text className="font-semibold text-center text-white">
              Aplicar ordenamiento
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
      {/* </Modal> */}
    </View>
  );
});
