// src/features/appointment/api/appointment.api.ts

import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
} from "@/features/appointment/types";
import { v4 as uuidv4 } from "uuid";
import { sendNotificationEmail } from "@/features/notification/api/notification.api";
import { getCustomerById } from "@/features/customer/api/customer.api";
import { getServiceById } from "@/features/service/api/service.api";
import { getProductById } from "@/features/product/api/product.api";

const APPOINTMENTS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/appointments`;
const PRODUCTS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

// Lấy danh sách lịch hẹn
export const getAppointments = async (): Promise<Appointment[]> => {
  console.log("Fetching appointments from API...");
  try {
    const response = await fetch(APPOINTMENTS_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch appointments.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

// Tạo lịch hẹn mới
export const createAppointment = async (
  appointmentData: Omit<Appointment, "id" | "status">
): Promise<Appointment> => {
  const response = await fetch(APPOINTMENTS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: `appt-${uuidv4()}`,
      status: "upcoming",
      // ✅ SỬA LỖI 2: Sử dụng paymentStatus được truyền vào, nếu không có thì mặc định là "unpaid"
      paymentStatus: appointmentData.paymentStatus || "unpaid",
      ...appointmentData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to create appointment: ${errorData}`);
  }

  const newAppointment: Appointment = await response.json();

  // Gửi email xác nhận
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

  return newAppointment;
};

/**
 * SỬA LỖI: Hàm đổi lịch hẹn, nhận vào newStart và newEnd
 */
export const rescheduleAppointment = async (
  appointmentId: string,
  newStart: string,
  newEnd: string
): Promise<Appointment> => {
  const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start: newStart, end: newEnd, status: "upcoming" }),
  });

  if (!response.ok) {
    throw new Error("Failed to reschedule appointment");
  }

  const updatedAppointment: Appointment = await response.json();

  // Gửi email thông báo đổi lịch
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

  return updatedAppointment;
};

// Cập nhật trạng thái lịch hẹn
export const updateAppointmentStatus = async (
  appointmentId: string,
  newStatus: AppointmentStatus,
  reason?: string
): Promise<Appointment> => {
  const body: { status: AppointmentStatus; cancellationReason?: string } = {
    status: newStatus,
  };

  if (newStatus === "cancelled" && reason) {
    body.cancellationReason = reason;
  }

  const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to update appointment status");
  }

  const updatedAppointment: Appointment = await response.json();

  // Logic gửi email khi hủy lịch có thể thêm ở đây
  // ...

  return updatedAppointment;
};

/**
 * SỬA LỖI: Hàm cập nhật chi tiết (kéo-thả), sử dụng start, end
 */
export const updateAppointmentDetails = async (
  appointmentId: string,
  updates: Partial<
    Pick<Appointment, "start" | "end" | "technicianId" | "resourceId">
  >
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

// Ghi nhận hoàn thành và trừ kho
export const logAppointmentCompletion = async (
  appointmentId: string,
  notes: string
): Promise<Appointment> => {
  const appointmentRes = await fetch(
    `${APPOINTMENTS_API_URL}/${appointmentId}`
  );
  if (!appointmentRes.ok) throw new Error("Không tìm thấy lịch hẹn.");
  const appointment: Appointment = await appointmentRes.json();
  const service = await getServiceById(appointment.serviceId);

  // Trừ kho sản phẩm tiêu hao
  if (service?.consumables && service.consumables.length > 0) {
    console.log(
      `Dịch vụ "${service.name}" có sản phẩm tiêu hao, tiến hành trừ kho...`
    );
    await Promise.all(
      service.consumables.map(async (consumable) => {
        const product = await getProductById(consumable.productId);
        if (product?.conversionRate && product.conversionRate > 0) {
          const stockUsed = consumable.quantityUsed / product.conversionRate;
          const newStock = product.stock - stockUsed;
          await fetch(`${PRODUCTS_API_URL}/${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: Math.max(0, newStock) }),
          });
          console.log(
            `Đã trừ kho "${product.name}", tồn kho mới: ${newStock.toFixed(
              2
            )} ${product.baseUnit}`
          );
        }
      })
    );
  }

  // Cập nhật trạng thái lịch hẹn
  const updates = {
    status: "completed" as AppointmentStatus,
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

// Lấy lịch hẹn theo ID khách hàng
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

// Cập nhật trạng thái thanh toán
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
