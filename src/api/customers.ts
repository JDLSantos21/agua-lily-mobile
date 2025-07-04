import { authStore } from "@/store/auth.store";
import { Customer } from "@/types/customers.types";

// const TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0ODM5MDg5NH0.HjcRaIAL350D-iWH7EKMecBbnXvdP2pJUTEdXaXZ_r8";

const TOKEN = authStore.getState().accessToken;

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// export async function getOrders() {
//   const ORDERS = `${BASE_URL}/orders?limit=10`;

//   const rawData = await fetch(ORDERS, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${TOKEN}`,
//       "Content-Type": "application/json",
//     },
//   });

//   const json = await rawData.json();

//   if (!rawData.ok) {
//     throw new Error(json.message || "Error fetching orders");
//   }

//   return json;
// }

export async function getCustomerByID(id: number) {
  const CUSTOMER = `${BASE_URL}/customers/${id}`;

  const rawData = await fetch(CUSTOMER, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const json = await rawData.json();

  if (json.success === false) {
    if (json.message === "Unauthorized") {
      throw new Error("Unauthorized access. Please check your token.");
    }
    throw new Error(json.message || "Error fetching order");
  }

  if (json.success === true && json.data) {
    return json.data as Customer;
  }

  throw new Error("Order not found or no data returned");
}
