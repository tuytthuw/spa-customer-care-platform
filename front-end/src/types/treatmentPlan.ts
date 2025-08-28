// src/types/treatmentPlan.ts
import { Service } from "./service";

export interface TreatmentPlan {
  id: string;
  name: string;
  description: string;
  serviceIds: string[];
  price: number;
  totalSessions: number; // Tổng số buổi trong liệu trình
  imageUrl: string;
  status: "active" | "inactive";
}
