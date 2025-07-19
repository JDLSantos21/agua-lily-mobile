export interface Equipment {
  id: number;
  serial_number: string;
  type: string;
  model: string;
  brand: string;
  capacity: number;
  capacity_unit: string;
  current_customer_id: number;
  contract_details: any;
  customer_address: string;
  status: string;
  last_maintenance_date: string;
  notes: any;
  latitude: number;
  longitude: number;
  location_created_at: string;
  assigned_date: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
}
