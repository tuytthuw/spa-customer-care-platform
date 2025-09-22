"use client";

import { StatsCard } from "@/features/reports/components/StatsCard";
import { UpcomingAppointments } from "@/features/dashboard/components/UpcomingAppointments";
import RevenueChart from "@/features/reports/components/RevenueChart";
import ServiceBreakdownChart from "@/features/reports/components/ServiceBreakdownChart";
import { Activity, CalendarCheck, DollarSign, Users } from "lucide-react";
import { useAppointments } from "@/features/appointment/hooks/useAppointments";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useInvoices } from "@/features/billing/hooks/useInvoices";
import { FullPageLoader } from "@/components/ui/spinner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export default function ManagerDashboard() {
  const { data: appointments = [], isLoading: loadingAppointments } =
    useAppointments();
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const { data: invoices = [], isLoading: loadingInvoices } = useInvoices();

  const isLoading = loadingAppointments || loadingCustomers || loadingInvoices;

  if (isLoading) {
    return <FullPageLoader text="Đang tải lịch hẹn hôm nay..." />;
  }

  // 3. Tính toán các số liệu thống kê từ dữ liệu thật
  const today = new Date().toDateString();

  const totalAppointmentsToday = appointments.filter(
    (app) => new Date(app.date).toDateString() === today
  ).length;

  const completedAppointmentsToday = appointments.filter(
    (app) =>
      new Date(app.date).toDateString() === today && app.status === "completed"
  ).length;

  const newCustomersToday = customers.filter(
    (customer) => new Date(customer.lastVisit).toDateString() === today
  ).length;

  // Tính doanh thu thật
  const revenueToday = invoices
    .filter(
      (invoice) =>
        new Date(invoice.createdAt).toDateString() === today &&
        invoice.status === "paid"
    )
    .reduce((total, invoice) => total + invoice.total, 0);

  // Tỷ lệ lấp đầy vẫn giữ giả lập vì logic phức tạp hơn
  const occupancyRate = "75%";

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* 4. Hiển thị dữ liệu động */}
          <StatsCard
            title="Doanh thu hôm nay"
            value={formatCurrency(revenueToday)}
            icon={DollarSign}
            description="+20.1% so với hôm qua"
          />
          <StatsCard
            title="Lịch hẹn hôm nay"
            value={`+${totalAppointmentsToday}`}
            icon={CalendarCheck}
            description={`${completedAppointmentsToday} lịch đã hoàn thành`}
          />
          <StatsCard
            title="Khách hàng mới"
            value={`+${newCustomersToday}`}
            icon={Users}
            description="trong hôm nay"
          />
          <StatsCard
            title="Tỷ lệ lấp đầy"
            value={occupancyRate}
            icon={Activity}
            description="Dựa trên lịch làm việc"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <RevenueChart />
          </div>
          <div className="lg:col-span-2">
            <ServiceBreakdownChart />
          </div>
        </div>

        <div>
          <UpcomingAppointments />
        </div>
      </div>
    </div>
  );
}
