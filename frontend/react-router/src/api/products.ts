import type { Product } from "../models/products";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API_BASE_URL = "https://ecomerce-project-jorge-main.onrender.com";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}