"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContexts";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  User,
  Users,
  ClipboardList,
  Settings,
  CalendarDays,
  LucideIcon,
  Briefcase,
  Star,
  Package,
  Inbox,
  UserCog,
} from "lucide-react";

// Định nghĩa cấu trúc của một link điều hướng
interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Định nghĩa các bộ link cho từng vai trò
const customerLinks: NavLink[] = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/profile", label: "Hồ sơ", icon: User },
  { href: "/appointments", label: "Lịch hẹn của tôi", icon: Calendar },
  { href: "/treatments", label: "Liệu trình của tôi", icon: Package },
  { href: "/reviews", label: "Đánh giá dịch vụ", icon: Star },
];

const technicianLinks: NavLink[] = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/schedule", label: "Lịch làm việc", icon: CalendarDays },
  { href: "/profile", label: "Hồ sơ", icon: User },
];

const receptionistLinks: NavLink[] = [
  {
    href: "/dashboard/inbox",
    label: "Hộp thư",
    icon: Inbox,
  },
  {
    href: "/appointments-management",
    label: "Quản lý Lịch hẹn",
    icon: Calendar,
  },
  { href: "/customers", label: "Quản lý Khách hàng", icon: Users },
  { href: "/profile", label: "Hồ sơ", icon: User },
];

const managerLinks: NavLink[] = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  {
    href: "/appointments-management",
    label: "Quản lý Lịch hẹn",
    icon: Calendar,
  },
  { href: "/customers", label: "Quản lý Khách hàng", icon: Users },
  {
    href: "/services-management",
    label: "Quản lý Dịch vụ",
    icon: ClipboardList,
  },
  { href: "/staff-management", label: "Quản lý Nhân viên", icon: Briefcase },
  {
    href: "/dashboard/manage-users",
    label: "Quản lý người dùng",
    icon: UserCog,
  },
  {
    href: "/work-schedule-management",
    label: "Quản lý Lịch làm việc",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Chọn bộ link phù hợp dựa trên vai trò của người dùng
  let navLinks: NavLink[] = [];
  switch (user?.role) {
    case "customer":
      navLinks = customerLinks;
      break;
    case "technician":
      navLinks = technicianLinks;
      break;
    case "receptionist":
      navLinks = receptionistLinks;
      break;
    case "manager":
      navLinks = managerLinks;
      break;
    default:
      // Mặc định là link của khách hàng nếu không có vai trò
      navLinks = customerLinks;
      break;
  }

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">MySpa Platform</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive && "bg-muted text-primary"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
