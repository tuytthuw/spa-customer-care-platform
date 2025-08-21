// src/services/serviceService.ts
import { mockServices } from "@/lib/mock-data";
import { Service } from "@/types/service";

// Mô phỏng việc gọi API để lấy danh sách dịch vụ
export const getServices = async (): Promise<Service[]> => {
  console.log("Fetching services from service...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve(mockServices);
};
