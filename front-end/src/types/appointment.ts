// src/types/appointment.ts
export interface Appointment {
  id: string;
  serviceId: string;
  technicianId?: string;
  date: string; // Sử dụng string dạng ISO 8601 cho dễ quản lý: "2025-09-10T10:00:00.000Z"
  status: "upcoming" | "completed" | "cancelled";
}
