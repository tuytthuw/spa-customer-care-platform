"use client";

import { useAuth } from "@/contexts/AuthContexts";
import CustomerDashboard from "@/features/dashboard/components/CustomerDashboard";
import ManagerDashboard from "@/features/dashboard/components/ManagerDashboard";
import TechnicianDashboard from "@/features/dashboard/components/TechnicianDashboard";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <FullPageLoader />;
  }

  switch (user.role) {
    case "manager":
    case "receptionist":
      return <ManagerDashboard />;
    case "technician":
      return <TechnicianDashboard />;
    case "customer":
      return <CustomerDashboard />;
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p>Vai trò của bạn không được hỗ trợ.</p>
        </div>
      );
  }
}
