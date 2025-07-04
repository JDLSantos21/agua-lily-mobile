export interface Customer {
  id?: number;
  name: string;
  contact_phone: string;
  has_whatsapp?: boolean;
  contact_email?: string | null;
  address: string;
  business_name?: string;
  is_business?: boolean;
  rnc?: string;
  location_reference?: string;
  notes?: string;
  status?: "activo" | "inactivo";
}
