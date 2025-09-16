// src/services/appointmentService.ts
import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
} from "@/features/appointment/types"; // <-- 1. THÊM AppointmentStatus VÀO IMPORT
import { v4 as uuidv4 } from "uuid";

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
// **MỚI: Hàm tạo lịch hẹn mới**
// Kiểu dữ liệu cho form đặt lịch (không bao gồm id, status)
type AppointmentCreationData = Omit<Appointment, "id" | "status">;

export const createAppointment = async (
  appointmentData: AppointmentCreationData
): Promise<Appointment> => {
  try {
    const response = await fetch(APPOINTMENTS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...appointmentData,
        id: `appt-${uuidv4()}`, // Tạo ID ngẫu nhiên
        status: "upcoming",
        paymentStatus: "unpaid",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create appointment: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error; // Ném lỗi ra để react-query có thể xử lý
  }
};

//Hàm cập nhật chi tiết lịch hẹn (cho kéo-thả)
export const updateAppointmentDetails = async (
  appointmentId: string,
  updates: Partial<Pick<Appointment, "date" | "technicianId">> // Chỉ cho phép cập nhật ngày hoặc technicianId
): Promise<Appointment> => {
  const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update appointment details");
  }

  return response.json();
};

// Hàm để kỹ thuật viên ghi nhận và hoàn thành lịch hẹn
export const logAppointmentCompletion = async (
  appointmentId: string,
  notes: string
): Promise<Appointment> => {
  const updates = {
    status: "completed",
    technicianNotes: notes,
  };

  const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to log appointment completion");
  }

  return response.json();
};

// Hàm lấy lịch hẹn theo ID khách hàng
export const getAppointmentsByCustomerId = async (
  customerId: string
): Promise<Appointment[]> => {
  if (!customerId) return [];
  console.log(`Fetching appointments for customer ${customerId}...`);
  try {
    const response = await fetch(
      `${APPOINTMENTS_API_URL}?customerId=${customerId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch appointments for customer.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching appointments by customer:", error);
    return [];
  }
};
export const updateAppointmentPaymentStatus = async (
  appointmentId: string,
  paymentStatus: PaymentStatus
): Promise<Appointment> => {
  const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update appointment payment status");
  }

  return response.json();
};
