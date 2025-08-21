// src/services/appointmentService.ts
import { mockAppointments } from "@/lib/mock-data";
import { Appointment } from "@/types/appointment";

// Mô phỏng việc gọi API để lấy danh sách lịch hẹn
export const getAppointments = async (): Promise<Appointment[]> => {
  console.log("Fetching appointments from service...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve(mockAppointments);
};
