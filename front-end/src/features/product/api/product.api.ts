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

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${PRODUCTS_API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null; // Không tìm thấy
      throw new Error("Failed to fetch product.");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
};
