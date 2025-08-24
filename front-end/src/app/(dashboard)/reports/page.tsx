"use client";

import StatCard from "@/features/reports/StatCard";
import RevenueChart from "@/features/reports/RevenueChart";
import ServiceBreakdownChart from "@/features/reports/ServiceBreakdownChart";
import { DollarSign, BookUser, UserPlus, Star } from "lucide-react";

const ReportsPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Báo cáo & Thống kê</h1>

      {/* 1. Các chỉ số chính */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Tổng doanh thu (Tháng)"
          value="125.600.000 VNĐ"
          icon={DollarSign}
        />
        <StatCard title="Lịch hẹn (Tháng)" value="180" icon={BookUser} />
        <StatCard title="Khách hàng mới" value="25" icon={UserPlus} />
        <StatCard
          title="Đánh giá trung bình"
          value="4.8"
          icon={Star}
          suffix="/ 5"
        />
      </div>

      {/* 2. Các biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <ServiceBreakdownChart />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
