import { api } from "@/services/api";
import { UpdateOrderStatusRequest } from "@/types/orders.types";

export async function getOrders() {
  return await api.get("/orders?limit=15").then((r) => r.data);
}

export async function getOrderByCode(code: string) {
  return await api.get(`/orders/track/${code}`).then((r) => r.data);
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
