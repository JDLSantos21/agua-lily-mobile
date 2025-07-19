export type OrderStatus =
  | "pendiente"
  | "preparando"
  | "despachado"
  | "entregado"
  | "cancelado";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  size: string;
  unit: string;
  notes: string | null;
}

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  status: OrderStatus;
  notes: string | null;
  updated_by: number;
  updated_by_name?: string;
  created_at: Date | string;
}

export interface Order {
  id?: number;
  tracking_code?: string;
  customer_id?: number | null;
  customer_name?: string;
  customer_phone: string;
  customer_address: string;
  order_date?: Date | string;
  scheduled_delivery_date?: Date | string | null;
  delivery_time_slot?: string | null;
  order_status?: OrderStatus;
  delivery_driver_id?: number | null;
  driver_name?: string | null;
  vehicle_tag?: string | null;
  vehicle_id?: number | null;
  delivery_notes?: string | null;
  notes?: string | null;
  created_by: number;
  items?: OrderItem[];
  status_history: OrderStatusHistory[];
  coordinates_lat: number | null;
  coordinates_lng: number | null;
  created_at: Date | string;
  updated_at: Date | string;
  coordinates_saved_at: Date | string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string | null;
  tracking_code?: string;
}
