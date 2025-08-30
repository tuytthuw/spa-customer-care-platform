// src/services/productService.ts
import { Product } from "@/features/product/types";

const PRODUCTS_API_URL = "http://localhost:3001/products";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(PRODUCTS_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
