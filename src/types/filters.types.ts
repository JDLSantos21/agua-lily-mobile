import { OrderStatus } from "./orders.types";

// Tipos basados en el schema de Zod del backend
export interface OrderFilters {
  search?: string;
  order_status?: OrderStatus;
  customer_id?: number;
  delivery_driver_id?: number;
  vehicle_id?: number;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  scheduled_date?: string; // YYYY-MM-DD
  limit?: number;
  offset?: number;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
}

// Tipos para la UI de filtros
export interface FilterOption<T> {
  value: T;
  label: string;
  icon?: string;
}

export interface DateRangeType {
  type: "all" | "today" | "week" | "month" | "custom";
  startDate?: Date;
  endDate?: Date;
}

export interface SortOption {
  field: string;
  label: string;
}

// Constantes para los filtros de UI
export const ORDER_STATUS_FILTERS: FilterOption<OrderStatus | undefined>[] = [
  { value: undefined, label: "Todos", icon: "list" },
  { value: "pendiente", label: "Pendientes", icon: "time" },
  { value: "preparando", label: "Preparando", icon: "restaurant" },
  { value: "despachado", label: "Despachados", icon: "car" },
  { value: "entregado", label: "Entregados", icon: "checkmark-circle" },
  { value: "cancelado", label: "Cancelados", icon: "close-circle" },
];

export const DATE_RANGE_FILTERS: FilterOption<DateRangeType["type"]>[] = [
  { value: "all", label: "Todos", icon: "infinite" },
  { value: "today", label: "Hoy", icon: "today" },
  { value: "week", label: "Esta semana", icon: "calendar" },
  { value: "month", label: "Este mes", icon: "calendar-outline" },
  { value: "custom", label: "Personalizado", icon: "calendar-sharp" },
];

export const SORT_OPTIONS: SortOption[] = [
  { field: "order_date", label: "Fecha de pedido" },
  { field: "customer_name", label: "Cliente" },
  { field: "order_status", label: "Estado" },
  { field: "scheduled_delivery_date", label: "Fecha de entrega" },
];

// Función para convertir DateRangeType a fechas del servidor
export const convertDateRangeToServerDates = (
  dateRange: DateRangeType
): { start_date?: string; end_date?: string } => {
  const now = new Date();

  switch (dateRange.type) {
    case "all":
      return {}; // No enviamos filtros de fecha para mostrar todos

    case "today":
      const today = now.toISOString().split("T")[0];
      return { start_date: today, end_date: today };

    case "week":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return {
        start_date: startOfWeek.toISOString().split("T")[0],
        end_date: endOfWeek.toISOString().split("T")[0],
      };

    case "month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      return {
        start_date: startOfMonth.toISOString().split("T")[0],
        end_date: endOfMonth.toISOString().split("T")[0],
      };

    case "custom":
      return {
        start_date: dateRange.startDate?.toISOString().split("T")[0],
        end_date: dateRange.endDate?.toISOString().split("T")[0],
      };

    default:
      return {};
  }
};
