// src/app/(dashboard)/layout.tsx
import React from "react";
import Sidebar from "@/features/shared/layout/dashboard/DashboardSidebar";
import Header from "@/features/shared/layout/dashboard/DashboardHeader";
import { AuthProvider } from "@/contexts/AuthContexts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-muted">
        {/* Sidebar chính (menu điều hướng) */}
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header mới */}
          <Header />
          {/* Main content sẽ chiếm phần còn lại */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
