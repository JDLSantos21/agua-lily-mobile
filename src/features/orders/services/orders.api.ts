import { api } from "@/lib/api";
import { Order, UpdateOrderStatusRequest } from "@/types/orders.types";
import { OrderFilters } from "@/types/filters.types";

export async function getOrders(filters?: OrderFilters) {
  // Construir los parámetros de query
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  // Si no hay filtros, usar valores por defecto
  if (!params.has("limit")) {
    params.append("limit", "15");
  }

  const queryString = params.toString();
  const url = queryString ? `/orders?${queryString}` : "/orders?limit=15";

  return await api.get(url).then((r) => {
    return r.data;
  });
}

interface GetOrderByCodeResponse {
  data: Order;
  success: boolean;
}

export async function getOrderByCode(code: string) {
  const res = await api.get(`/orders/track/${code}`);
  return res.data as GetOrderByCodeResponse;
}

export async function updateOrderStatus(
  orderId: number,
  data: UpdateOrderStatusRequest
): Promise<{ success: boolean; message: string }> {
  return await api
    .patch(`/orders/${orderId}/status`, {
      status: data.status,
      notes: data.notes || null,
    })
    .then((r) => r.data)
    .catch((error) => {
      console.error("Error updating order status:", error);
      return null;
    });
}
