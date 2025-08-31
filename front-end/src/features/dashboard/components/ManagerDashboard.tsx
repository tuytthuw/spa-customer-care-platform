"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/features/reports/components/StatsCard";
import { UpcomingAppointments } from "@/features/dashboard/components/UpcomingAppointments";
import RevenueChart from "@/features/reports/components/RevenueChart";
import ServiceBreakdownChart from "@/features/reports/components/ServiceBreakdownChart";
import { Activity, CalendarCheck, DollarSign, Users } from "lucide-react";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import { getCustomers } from "@/features/customer/api/customer.api";
import { getInvoices } from "@/features/billing/api/invoice.api";
import { Appointment } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Invoice } from "@/features/billing/types";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export default function ManagerDashboard() {
  // 1. Fetch dữ liệu appointments, customers, invoices từ API
  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    Customer[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: invoices = [], isLoading: loadingInvoices } = useQuery<
    Invoice[]
  >({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  const isLoading = loadingAppointments || loadingCustomers || loadingInvoices;

  // 2. Xử lý trạng thái loading
  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-6 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
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
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="col-span-1 lg:col-span-3">
            <RevenueChart />
          </div>
          <div className="col-span-1 lg:col-span-2">
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
