// src/services/appointmentService.ts
import { Appointment, AppointmentStatus } from "@/types/appointment"; // <-- 1. THÊM AppointmentStatus VÀO IMPORT

// URL API mới trỏ đến json-server
const APPOINTMENTS_API_URL = "http://localhost:3001/appointments";

// Mô phỏng việc gọi API để lấy danh sách lịch hẹn
export const getAppointments = async (): Promise<Appointment[]> => {
  console.log("Fetching appointments from API...");
  try {
    const response = await fetch(APPOINTMENTS_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch appointments.");
    }

    const appointments: Appointment[] = await response.json();
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

// 2. Hàm cập nhật trạng thái đã hoàn thiện
export const updateAppointmentStatus = async (
  appointmentId: string,
  newStatus: AppointmentStatus
): Promise<Appointment> => {
  const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update appointment status");
  }

  return response.json();
};
