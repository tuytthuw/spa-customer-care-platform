// src/app/(dashboard)/layout.tsx
import React from "react";
import Sidebar from "@/components/layout/dashboard/DashboardSidebar";
import Header from "@/components/layout/dashboard/DashboardHeader";
import { AuthProvider } from "@/contexts/AuthContexts"; // Đảm bảo bọc trong AuthProvider

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
