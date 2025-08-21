// src/services/staffService.ts
import { mockStaff } from "@/lib/mock-data";
import { Staff } from "@/types/staff";

// Mô phỏng việc gọi API để lấy danh sách nhân viên
export const getStaff = async (): Promise<Staff[]> => {
  console.log("Fetching staff from service...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve(mockStaff);
};
