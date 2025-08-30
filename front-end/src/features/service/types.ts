// src/types/service.ts
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  imageUrl: string;
  status: "active" | "inactive";
}
