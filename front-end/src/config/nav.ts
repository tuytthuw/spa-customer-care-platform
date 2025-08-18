import type { Role } from "@/providers/auth-context";

type NavItem = { label: string; href: string };
export const navByRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Tổng quan", href: "/admin" },
    { label: "Dịch vụ", href: "/admin/services" },
    { label: "Nhân sự", href: "/admin/staff" },
    { label: "Người dùng", href: "/admin/users" },
    { label: "Báo cáo", href: "/admin/reports" },
  ],
  RECEPTION: [
    { label: "Hôm nay", href: "/reception" },
    { label: "Tạo lịch", href: "/reception/appointments/new" },
    { label: "Check-in", href: "/reception/appointments/checkin" },
    { label: "Khách hàng", href: "/reception/customers/search" },
    { label: "Thanh toán", href: "/reception/billing" },
  ],
  TECH: [
    { label: "Lịch làm việc", href: "/tech/schedule" },
    { label: "Khách hàng", href: "/tech/customers" },
  ],
  CLIENT: [
    { label: "Trang của tôi", href: "/client" },
    { label: "Dịch vụ", href: "/client/services" },
    { label: "Đặt lịch", href: "/client/appointments/new" },
    { label: "Liệu trình", href: "/client/treatments" },
    { label: "Đánh giá", href: "/client/reviews" },
    { label: "Hỗ trợ", href: "/client/support" },
    { label: "Lịch của tôi", href: "/client/appointments/my" },
  ],
};
