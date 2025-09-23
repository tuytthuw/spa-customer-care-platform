// src/types/service.ts
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  categories: string[];
  imageUrl: string;
  imageUrls: string[];
  status: "active" | "inactive";
  consumables?: ServiceConsumable[];
}
export interface ServiceConsumable {
  productId: string;
  quantityUsed: number;
}
