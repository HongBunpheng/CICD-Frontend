import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_API_URL is not set. Create a .env file from .env.example and set VITE_API_URL.",
  );
}

export const isApiConfigured = Boolean(apiUrl);

export const api = axios.create({
  baseURL: apiUrl,
});

export const demoProducts = [
  {
    id: 1,
    name: "Laptop",
    description: "Demo product (set VITE_API_URL to load real data).",
    price: 999,
    imageUrl: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Phone",
    description: "Demo product (set VITE_API_URL to load real data).",
    price: 499,
    imageUrl: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Headphones",
    description: "Demo product (set VITE_API_URL to load real data).",
    price: 199,
    imageUrl: "",
    createdAt: new Date().toISOString(),
  },
];

export async function fetchProducts() {
  if (!isApiConfigured) return demoProducts;
  const res = await api.get("/api/products");
  return res.data;
}

export async function createOrder(payload) {
  if (!isApiConfigured) {
    throw new Error("Backend not configured (VITE_API_URL missing).");
  }
  const res = await api.post("/api/orders", payload);
  return res.data;
}
