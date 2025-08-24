// src/types/permissions.ts

// Liệt kê tất cả các chức năng có thể được cấp quyền trong hệ thống
export const PERMISSIONS = {
  // Customer Permissions
  VIEW_APPOINTMENTS: "view_appointments",
  VIEW_TREATMENTS: "view_treatments",
  VIEW_REVIEWS: "view_reviews",
  // Receptionist Permissions
  MANAGE_APPOINTMENTS: "manage_appointments",
  VIEW_INBOX: "view_inbox",
  // Technician Permissions
  VIEW_SCHEDULE: "view_schedule",
  // Manager Permissions
  VIEW_REPORTS: "view_reports",
  MANAGE_USERS: "manage_users",
  MANAGE_PRODUCTS: "manage_products",
  MANAGE_SERVICES: "manage_services",
  MANAGE_SCHEDULES: "manage_schedules",
  MANAGE_PERMISSIONS: "manage_permissions", // Quyền để quản lý quyền
} as const;

// Tạo một Type từ object trên để sử dụng trong TypeScript
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Định nghĩa cấu trúc cho một vai trò
export interface Role {
  id: "customer" | "receptionist" | "technician" | "manager";
  name: string;
  permissions: Permission[];
}
