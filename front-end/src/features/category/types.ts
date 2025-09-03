// src/features/category/types.ts
export interface Category {
  id: string;
  name: string;
  type: "service" | "product" | "treatment";
}
