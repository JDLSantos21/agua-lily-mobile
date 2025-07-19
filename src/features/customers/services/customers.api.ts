import { api } from "@/lib/api";

export async function getCustomerByID(id: number) {
  const res = await api.get(`customers/${id}`).then((r) => r.data);
  return res;
}

export async function updateCustomerLocation(
  id: number,
  location: { lat: number; lng: number }
) {
  const res = await api.patch(`customers/coordinates/${id}`, location);
  return res.data;
}
