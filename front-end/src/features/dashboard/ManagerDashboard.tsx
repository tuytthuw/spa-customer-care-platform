"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// GIỮ LẠI CÁC COMPONENT GỐC
import { StatsCard } from "@/features/reports/StatsCard";
import { UpcomingAppointments } from "@/features/dashboard/UpcomingAppointments";

// THÊM CÁC BIỂU ĐỒ MỚI TỪ TRANG REPORTS
import RevenueChart from "@/features/reports/RevenueChart";
import ServiceBreakdownChart from "@/features/reports/ServiceBreakdownChart";

import { Activity, CalendarCheck, DollarSign, Users } from "lucide-react";

export default function ManagerDashboard() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        {/* Giữ nguyên các thẻ thống kê gốc của bạn */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Doanh thu hôm nay"
            value="12,500,000đ"
            icon={DollarSign}
            description="+20.1% so với hôm qua"
          />
          <StatsCard
            title="Lịch hẹn hôm nay"
            value="+15"
            icon={CalendarCheck}
            description="3 lịch đã hoàn thành"
          />
          <StatsCard
            title="Khách hàng mới"
            value="+5"
            icon={Users}
            description="+2 so với hôm qua"
          />
          <StatsCard
            title="Tỷ lệ lấp đầy"
            value="75%"
            icon={Activity}
            description="Dựa trên lịch làm việc"
          />
        </div>

        {/* THAY THẾ VÀ BỔ SUNG BIỂU ĐỒ MỚI */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Biểu đồ doanh thu mới */}
          <div className="col-span-1 lg:col-span-3">
            <RevenueChart />
          </div>
          {/* Biểu đồ tỉ trọng dịch vụ mới */}
          <div className="col-span-1 lg:col-span-2">
            <ServiceBreakdownChart />
          </div>
        </div>

        {/* Giữ nguyên Lịch hẹn sắp tới */}
        <div>
          <UpcomingAppointments />
        </div>
      </div>
    </div>
  );
}
