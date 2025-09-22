// Định nghĩa các quyền có thể có
export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Định nghĩa các module/tính năng trong hệ thống
export const FEATURES = {
  dashboard: "dashboard",
  appointments: "appointments",
  appointments_management: "appointments_management",
  customers: "customers",
  staff: "staff",
  services: "services",
  products: "products",
  categories: "categories",
  resources: "resources",
  schedules: "schedules",
  reports: "reports",
  billing: "billing",
  users: "users",
  roles: "roles",
  treatments: "treatments",
  reviews: "reviews",
  profile: "profile",
  promotions: "promotions",
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
