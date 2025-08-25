// src/services/appointmentService.ts
import { Appointment } from "@/types/appointment";

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
