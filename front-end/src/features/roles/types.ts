// src/features/roles/types.ts

// Định nghĩa các quyền có thể có
export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Định nghĩa các module/tính năng trong hệ thống
export const FEATURES = {
  // --- Giao diện chung ---
  dashboard: "dashboard",

  // --- Phân hệ Khách hàng ---
  appointments: "appointments",
  treatments: "treatments",
  billing: "billing",
  reviews: "reviews",
  profile: "profile",

  // --- Phân hệ Quản lý ---
  appointments_management: "appointments_management",
  customers: "customers",
  staff: "staff",
  services: "services",
  products: "products",
  categories: "categories",
  resources: "resources",
  schedules: "schedules",
  reports: "reports",
  users: "users",
  roles: "roles",
  promotions: "promotions",
  loyalty: "loyalty",
  marketing: "marketing",
  inbox: "inbox",
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];

// Cấu trúc của một đối tượng Role
export interface Role {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  permissions: {
    [key in Feature]?: Permission[];
  };
}
