// src/types/treatmentPlan.ts
import { Service } from "./service";

export interface TreatmentPlan {
  id: string;
  name: string;
  description: string;
  // Một liệu trình có thể bao gồm một hoặc nhiều dịch vụ lẻ
  serviceIds: string[];
  price: number;
  totalSessions: number; // Tổng số buổi trong liệu trình
  imageUrl: string;
}
