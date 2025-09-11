"use client";

// 1. Sửa lại import để dùng StatsCard từ dashboard
import { StatsCard } from "@/features/reports/components/StatsCard";
import RevenueChart from "@/features/reports/components/RevenueChart";
import ServiceBreakdownChart from "@/features/reports/components/ServiceBreakdownChart";
import { DollarSign, BookUser, UserPlus, Star } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

const ReportsPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Báo cáo & Thống kê" />
      {/* 2. Sửa lại cách gọi component và thêm prop "description" */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Tổng doanh thu (Tháng)"
          value="125.600.000 VNĐ"
          icon={DollarSign}
          description="So với tháng trước"
        />
        <StatsCard
          title="Lịch hẹn (Tháng)"
          value="180"
          icon={BookUser}
          description="Tăng 15% so với tháng trước"
        />
        <StatsCard
          title="Khách hàng mới (Tháng)"
          value="25"
          icon={UserPlus}
          description="Tổng số khách hàng: 350"
        />
        <StatsCard
          title="Đánh giá trung bình"
          value="4.8 / 5"
          icon={Star}
          description="Dựa trên 50 đánh giá"
        />
      </div>

      {/* Phần biểu đồ giữ nguyên */}
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
