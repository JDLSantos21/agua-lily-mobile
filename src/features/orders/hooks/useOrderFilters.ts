import { useState, useMemo } from "react";
import {
  OrderFilters,
  DateRangeType,
  convertDateRangeToServerDates,
} from "@/types/filters.types";
import { OrderStatus } from "@/types/orders.types";

// Estado de la UI para los filtros
interface FilterUIState {
  searchQuery: string; // El valor del input
  searchTerm: string; // El valor que se envía al servidor
  selectedStatus: OrderStatus | undefined;
  dateRange: DateRangeType;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

const getDefaultUIState = (): FilterUIState => ({
  searchQuery: "",
  searchTerm: "",
  selectedStatus: undefined,
  dateRange: { type: "all" },
  sortBy: "order_date",
  sortOrder: "DESC",
});

export const useOrderFilters = () => {
  const [uiState, setUIState] = useState<FilterUIState>(getDefaultUIState());

  // Convertir el estado de UI a filtros del servidor
  const serverFilters = useMemo((): OrderFilters => {
    const dateFilters = convertDateRangeToServerDates(uiState.dateRange);

    return {
      search: uiState.searchTerm.trim() || undefined,
      order_status: uiState.selectedStatus,
      ...dateFilters,
      order_by: uiState.sortBy,
      order_direction: uiState.sortOrder,
      limit: 15,
      offset: 0,
    };
  }, [
    uiState.selectedStatus,
    uiState.dateRange,
    uiState.sortBy,
    uiState.sortOrder,
    uiState.searchTerm,
  ]);

  // Funciones para actualizar el estado de UI
  const updateSearchQuery = (query: string) => {
    setUIState((prev) => ({ ...prev, searchQuery: query }));
  };

  const executeSearch = () => {
    setUIState((prev) => ({ ...prev, searchTerm: prev.searchQuery }));
  };

  const updateStatus = (status: OrderStatus | undefined) => {
    setUIState((prev) => ({ ...prev, selectedStatus: status }));
  };

  const updateDateRange = (dateRange: DateRangeType) => {
    setUIState((prev) => ({ ...prev, dateRange }));
  };

  const updateSort = (sortBy: string, sortOrder: "ASC" | "DESC") => {
    setUIState((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const resetFilters = () => {
    setUIState({
      searchQuery: "",
      searchTerm: "",
      selectedStatus: undefined,
      dateRange: { type: "all" },
      sortBy: "order_date",
      sortOrder: "DESC",
    });
  };

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;

    if (uiState.searchTerm.trim()) count++;
    if (uiState.selectedStatus) count++;
    if (uiState.dateRange.type !== "all") count++;

    return count;
  }, [uiState.searchTerm, uiState.selectedStatus, uiState.dateRange]);

  return {
    uiState,
    serverFilters,
    activeFiltersCount,
    updateSearchQuery,
    executeSearch,
    updateStatus,
    updateDateRange,
    updateSort,
    resetFilters,
  };
};
