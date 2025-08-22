"use client";

import { useAuth } from "@/contexts/AuthContexts";
import ManagerDashboard from "@/features/dashboard/ManagerDashboard";
import TechnicianDashboard from "@/features/dashboard/TechnicianDashboard";
import CustomerDashboard from "@/features/dashboard/CustomerDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  // Hiển thị trạng thái tải trong khi chờ thông tin người dùng
  if (!user) {
    return <div>Đang tải thông tin...</div>;
  }

  // Dựa vào vai trò để hiển thị component dashboard tương ứng
  switch (user.role) {
    case "manager":
    case "receptionist":
      return <ManagerDashboard />; // Giao diện cho quản lý và lễ tân
    case "technician":
      return <TechnicianDashboard />; // Giao diện cho kỹ thuật viên
    case "customer":
      return <CustomerDashboard />; // Giao diện cho khách hàng
    default:
      // Fallback trong trường hợp vai trò không xác định
      return <div>Vai trò của bạn không được hỗ trợ để xem trang này.</div>;
  }
}
