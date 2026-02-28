import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_API_URL is not set. Create a .env file from .env.example and set VITE_API_URL.",
  );
}

export const api = axios.create({
  baseURL: apiUrl,
});

export async function fetchProducts() {
  const res = await api.get("/api/products");
  return res.data;
}

export async function createOrder(payload) {
  const res = await api.post("/api/orders", payload);
  return res.data;
}

