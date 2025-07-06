import { api } from "@/services/api";

export async function getCustomerByID(id: number) {
  const res = await api.get(`customers/${id}`).then((r) => r.data);

  console.log("Customer data:", res);
  return res;
}
