// src/components/layout/dashboard/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  Home,
  User,
  Calendar,
  Settings,
  Users,
  Briefcase,
  DollarSign,
} from "lucide-react"; // Các icon cho menu

// Định nghĩa các link cho từng vai trò
const navLinks = {
  customer: [
    { href: "/dashboard/profile", label: "Hồ Sơ Của Tôi", icon: User },
    {
      href: "/dashboard/appointments",
      label: "Lịch Hẹn Của Tôi",
      icon: Calendar,
    },
  ],
  technician: [
    { href: "/dashboard/schedule", label: "Lịch Làm Việc", icon: Calendar },
  ],
  receptionist: [
    {
      href: "/dashboard/manage-appointments",
      label: "Quản Lý Lịch Hẹn",
      icon: Calendar,
    },
    { href: "/dashboard/customers", label: "Quản Lý Khách Hàng", icon: Users },
  ],
  manager: [
    { href: "/dashboard/overview", label: "Tổng Quan", icon: Home },
    {
      href: "/dashboard/manage-users",
      label: "Quản Lý Tài Khoản",
      icon: Users,
    },
    {
      href: "/dashboard/manage-services",
      label: "Quản Lý Dịch Vụ",
      icon: Briefcase,
    },
    { href: "/dashboard/finance", label: "Tài Chính", icon: DollarSign },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  // Giả sử vai trò là 'customer' nếu chưa có user thật
  const role = user?.role || "customer";

  // Lấy danh sách link dựa trên vai trò
  const links = navLinks[role as keyof typeof navLinks] || [];

  return (
    <aside className="w-64 bg-white text-gray-800 p-4 shadow-md">
      <div className="text-2xl font-bold mb-8">Spa Platform</div>
      <nav>
        <ul>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href} className="mb-4">
                <Link
                  href={link.href}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
