// src/components/layout/dashboard/DashboardSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContexts";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  ShoppingBag,
  Building,
  ClipboardCheck,
  FolderKanban,
  UserCog,
  ShieldCheck,
  Package,
  Star,
  ReceiptText,
  BarChart2,
  Gem,
  Megaphone,
  Inbox,
  Warehouse,
  CreditCard,
} from "lucide-react";
import { Feature } from "@/features/roles/types";

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  requiredFeature: Feature;
}

const allNavLinks: NavLink[] = [
  // --- CHUNG ---
  {
    href: "/dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
    requiredFeature: "dashboard",
  },
  {
    href: "/profile",
    label: "Hồ sơ cá nhân",
    icon: UserCog,
    requiredFeature: "profile",
  },
  { href: "/inbox", label: "Hộp thư", icon: Inbox, requiredFeature: "inbox" },

  // --- DÀNH CHO KHÁCH HÀNG ---
  {
    href: "/customer-schedules",
    label: "Lịch Trình của tôi",
    icon: Calendar,
    requiredFeature: "appointments",
  },
  {
    href: "/invoices",
    label: "Lịch sử mua hàng",
    icon: ReceiptText,
    requiredFeature: "billing",
  },
  {
    href: "/reviews",
    label: "Đánh giá của tôi",
    icon: Star,
    requiredFeature: "reviews",
  },

  {
    href: "/prepaid-card",
    label: "Thẻ trả trước",
    icon: CreditCard,
    requiredFeature: "billing", // Tái sử dụng quyền 'billing' cho khách hàng
  },

  // --- DÀNH CHO NHÂN VIÊN/QUẢN LÝ ---
  {
    href: "/manage-appointments",
    label: "Quản lý Lịch hẹn",
    icon: Calendar,
    requiredFeature: "appointments_management",
  },
  {
    href: "/customers",
    label: "Quản lý Khách hàng",
    icon: Users,
    requiredFeature: "customers",
  },
  {
    href: "/billing/new",
    label: "Bán hàng & Thanh toán",
    icon: ReceiptText,
    requiredFeature: "billing",
  },

  // --- DÀNH CHO QUẢN LÝ ---
  {
    href: "/manage-staffs",
    label: "Quản lý Nhân viên",
    icon: Briefcase,
    requiredFeature: "staff",
  },
  {
    href: "/manage-services-treatmentplans",
    label: "Dịch vụ & Liệu trình",
    icon: Package,
    requiredFeature: "services",
  },
  {
    href: "/manage-products",
    label: "Sản phẩm",
    icon: ShoppingBag,
    requiredFeature: "products",
  },
  {
    href: "/manage-categories",
    label: "Danh mục",
    icon: FolderKanban,
    requiredFeature: "categories",
  },
  {
    href: "/manage-resources",
    label: "Tài nguyên",
    icon: Building,
    requiredFeature: "resources",
  },
  {
    href: "/resource-schedule",
    label: "Lịch trình tài nguyên",
    icon: ClipboardCheck,
    requiredFeature: "resources",
  },
  {
    href: "/manage-schedules",
    label: "Lịch làm việc",
    icon: Calendar,
    requiredFeature: "schedules",
  },
  {
    href: "/reports/revenue",
    label: "Báo cáo Doanh thu",
    icon: BarChart2,
    requiredFeature: "reports",
  },
  {
    href: "/reports/inventory",
    label: "Báo cáo Tồn kho",
    icon: Warehouse,
    requiredFeature: "reports", // Dùng chung quyền báo cáo
  },
  {
    href: "/manage-promotions",
    label: "Khuyến mãi",
    icon: Megaphone,
    requiredFeature: "promotions",
  },
  {
    href: "/manage-loyalty",
    label: "Khách hàng thân thiết",
    icon: Gem,
    requiredFeature: "loyalty",
  },
  {
    href: "/manage-users",
    label: "Quản lý người dùng",
    icon: UserCog,
    requiredFeature: "users",
  },
  {
    href: "/manage-roles",
    label: "Phân quyền",
    icon: ShieldCheck,
    requiredFeature: "roles",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const accessibleNavLinks = allNavLinks.filter((link) =>
    user?.permissions[link.requiredFeature]?.includes("read")
  );

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">MySpa Platform</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {accessibleNavLinks.map((link) => {
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
