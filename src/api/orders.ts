import { api } from "@/services/api";
import { authStore } from "@/store/auth.store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getOrders() {
  const token = authStore.getState().accessToken;
  if (!token) {
    throw new Error("Access token is missing. Please log in.");
  }

  const res = await api.get("/orders?limit=10").then((r) => r.data);

  return res;
}

export async function getOrderByCode(code: string) {
  // const ORDER = `${BASE_URL}/orders/track/${code}`;

  const token = authStore.getState().accessToken;
  if (!token) {
    throw new Error("Access token is missing. Please log in.");
  }

  const url = `${BASE_URL}/orders//track/${code}`;

  const rawData = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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
    return json.data;
  }

  throw new Error("Order not found or no data returned");
}
