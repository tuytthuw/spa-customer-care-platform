// src/services/serviceService.ts
import { Service } from "@/types/service";

// THAY THẾ URL CỦA BẠN VÀO ĐÂY
const SERVICES_API_URL = "https://68ab3267909a5835049dfccd.mockapi.io/services";

// Mô phỏng việc gọi API để lấy danh sách dịch vụ
export const getServices = async (): Promise<Service[]> => {
  console.log("Fetching services from API...");
  try {
    const response = await fetch(SERVICES_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch services.");
    }

    const services: Service[] = await response.json();
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};
