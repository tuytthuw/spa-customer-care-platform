// src/features/category/api/category.api.ts
import { Category } from "@/features/category/types";
import { v4 as uuidv4 } from "uuid";

const CATEGORIES_API_URL = "http://localhost:3001/categories";

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(CATEGORIES_API_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch categories.");
  return response.json();
};

export type CategoryFormData = Omit<Category, "id">;

export const addCategory = async (
  data: CategoryFormData
): Promise<Category> => {
  const newCategory = { ...data, id: `cat-${uuidv4()}` };
  const response = await fetch(CATEGORIES_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCategory),
  });
  if (!response.ok) throw new Error("Failed to add category.");
  return response.json();
};

export const updateCategory = async (
  id: string,
  data: Partial<CategoryFormData>
): Promise<Category> => {
  const response = await fetch(`${CATEGORIES_API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update category.");
  return response.json();
};

export const deleteCategory = async (id: string): Promise<void> => {
  const response = await fetch(`${CATEGORIES_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete category.");
};
