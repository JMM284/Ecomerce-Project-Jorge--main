import type { Product } from "../models/products";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Fetches the list of products from the backend
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}