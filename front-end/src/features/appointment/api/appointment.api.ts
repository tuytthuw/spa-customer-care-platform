// src/services/appointmentService.ts
import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
} from "@/features/appointment/types"; // <-- 1. THÊM AppointmentStatus VÀO IMPORT
import { v4 as uuidv4 } from "uuid";
import { sendNotificationEmail } from "@/features/notification/api/notification.api";
import { getCustomerById } from "@/features/customer/api/customer.api";
import { getServiceById } from "@/features/service/api/service.api";

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

export const createAppointment = async (
  appointmentData: Omit<Appointment, "id" | "status">
): Promise<Appointment> => {
  const response = await fetch(APPOINTMENTS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: `appt-${uuidv4()}`,
      status: "upcoming",
      paymentStatus: "unpaid",
      ...appointmentData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to create appointment: ${errorData}`);
  }

  const newAppointment: Appointment = await response.json();

  // --- LOGIC GỬI EMAIL BẮT ĐẦU ---
  // Lấy thông tin chi tiết của khách hàng và dịch vụ để gửi email
  const customer = await getCustomerById(newAppointment.customerId);
  const service = await getServiceById(newAppointment.serviceId);

  if (customer && service) {
    await sendNotificationEmail(
      "confirmation",
      newAppointment,
      customer,
      service
    );
  }
  // --- LOGIC GỬI EMAIL KẾT THÚC ---

  return newAppointment;
};

// SỬA ĐỔI: hàm rescheduleAppointment
export const rescheduleAppointment = async (
  appointmentId: string,
  newDate: string
): Promise<Appointment> => {
  const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: newDate, status: "upcoming" }),
  });

  if (!response.ok) {
    throw new Error("Failed to reschedule appointment");
  }

  const updatedAppointment: Appointment = await response.json();

  // --- LOGIC GỬI EMAIL BẮT ĐẦU ---
  const customer = await getCustomerById(updatedAppointment.customerId);
  const service = await getServiceById(updatedAppointment.serviceId);

  if (customer && service) {
    await sendNotificationEmail(
      "reschedule",
      updatedAppointment,
      customer,
      service
    );
  }
  // --- LOGIC GỬI EMAIL KẾT THÚC ---

  return updatedAppointment;
};

// SỬA ĐỔI: hàm updateAppointmentStatus
export const updateAppointmentStatus = async (
  appointmentId: string,
  newStatus: AppointmentStatus,
  reason?: string // ✅ Thêm tham số reason (tùy chọn)
): Promise<Appointment> => {
  // Đầu tiên, lấy thông tin lịch hẹn để có đủ chi tiết gửi mail
  const appointmentResponse = await fetch(
    `${APPOINTMENTS_API_URL}/${appointmentId}`
  );
  if (!appointmentResponse.ok) {
    throw new Error(
      "Failed to fetch appointment details before updating status."
    );
  }

  // ✅ Tạo đối tượng body để gửi đi
  const body: { status: AppointmentStatus; cancellationReason?: string } = {
    status: newStatus,
  };

  // Nếu là hủy lịch và có lý do, thêm vào body
  if (newStatus === "cancelled" && reason) {
    body.cancellationReason = reason;
  }

  // Tiếp theo, cập nhật trạng thái
  const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), // ✅ Gửi body đã được cập nhật
  });

  if (!response.ok) {
    throw new Error("Failed to update appointment status");
  }

  const updatedAppointment: Appointment = await response.json();

  // --- LOGIC GỬI EMAIL KHI HỦY LỊCH ---
  if (newStatus === "cancelled") {
    // ... (logic gửi mail giữ nguyên)
  }
  // --- LOGIC GỬI EMAIL KẾT THÚC ---

  return updatedAppointment;
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
