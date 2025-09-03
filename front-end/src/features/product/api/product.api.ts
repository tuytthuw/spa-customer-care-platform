// src/services/productService.ts
import { Product } from "@/features/product/types";
import { v4 as uuidv4 } from "uuid";
import { da } from "zod/v4/locales";

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

interface ProductFormData {
  name: string;
  description?: string;
  categories?: string[];
  price: number;
  stock: number;
  imageFile?: File;
}

export const addProduct = async (
  newServiceData: ProductFormData
): Promise<Product> => {
  console.log("Sending new service to API...", newServiceData);

  // Vì json-server không thể lưu file, chúng ta sẽ bỏ qua file ảnh
  // và chỉ lưu các dữ liệu khác.
  const { imageFile, ...dataToSave } = newServiceData;

  const response = await fetch(PRODUCTS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: uuidv4(),
      ...dataToSave,
      status: "active",
      // Tạo một ảnh placeholder ngẫu nhiên từ các ảnh có sẵn
      imageUrl: `/images/service-${Math.floor(Math.random() * 3) + 1}.jpg`,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add product");
  }

  return response.json();
};

export const updateProduct = async (
  serviceId: string,
  dataToUpdate: ProductFormData
): Promise<Product> => {
  console.log(`Updating service ${serviceId} with data:`, dataToUpdate);

  const { imageFile, ...data } = dataToUpdate;

  const response = await fetch(`${PRODUCTS_API_URL}/${serviceId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update product.");
  }
  return response.json();
};

export const updateProducteStatus = async (
  serviceId: string,
  newStatus: "active" | "inactive"
): Promise<Product> => {
  console.log(`Updating service ${serviceId} to status: ${newStatus}`);

  const response = await fetch(`${PRODUCTS_API_URL}/${serviceId}`, {
    method: "PATCH", // Dùng PATCH để cập nhật một phần
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update product status");
  }

  return response.json();
};
