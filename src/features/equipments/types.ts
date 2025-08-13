export interface Equipment {
  id: number;
  serial_number: string;
  type: "anaquel" | "nevera" | "otros";
  model: string;
  brand: string;
  capacity: number;
  capacity_unit: string;
  current_customer_id: number;
  contract_details: any;
  customer_address: string;
  status: string;
  show_in_mobile: boolean;
  require_gps_update: 0 | 1;
  last_maintenance_date: string;
  notes: any;
  latitude: number;
  longitude: number;
  location_created_at: string;
  assigned_date: string | null;
  delivered_date: string | null;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
}
