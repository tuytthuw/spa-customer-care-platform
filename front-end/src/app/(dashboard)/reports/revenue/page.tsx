// src/app/(dashboard)/reports/revenue/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { DollarSign, Users, CalendarCheck } from "lucide-react";
import { useInvoices } from "@/features/billing/hooks/useInvoices";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { DateRangePicker } from "@/features/shared/components/ui/date-range-picker"; // Giả định có component này
import { DateRange } from "react-day-picker";
import { subDays, startOfDay } from "date-fns";
import RevenueOverTimeChart from "@/features/reports/components/RevenueOverTimeChart";

export default function RevenueReportPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(subDays(new Date(), 29)),
    to: new Date(),
  });

  const { data: invoices = [], isLoading: isLoadingInvoices } = useInvoices();
  const { data: customers = [], isLoading: isLoadingCustomers } =
    useCustomers();

  // --- Lọc dữ liệu theo khoảng thời gian đã chọn ---
  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.createdAt);
    if (!dateRange?.from || !dateRange?.to) return true;
    return invoiceDate >= dateRange.from && invoiceDate <= dateRange.to;
  });

  const filteredNewCustomers = customers.filter((customer) => {
    const joinDate = new Date(customer.joinedDate);
    if (!dateRange?.from || !dateRange?.to) return true;
    return joinDate >= dateRange.from && joinDate <= dateRange.to;
  });

  // --- Tính toán các chỉ số thống kê ---
  const totalRevenue = filteredInvoices.reduce(
    (sum, inv) => sum + inv.totalAmount,
    0
  );
  const completedAppointments = filteredInvoices.filter(
    (inv) => inv.appointmentId
  ).length;
  const newCustomersCount = filteredNewCustomers.length;

  const formattedTotalRevenue = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(totalRevenue);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Báo cáo Doanh thu"
          description="Phân tích doanh thu và hiệu suất kinh doanh."
        />
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

      <div className="grid gap-4 md:grid-cols-3 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedTotalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              dựa trên {filteredInvoices.length} hóa đơn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lịch hẹn hoàn thành
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{completedAppointments}</div>
            <p className="text-xs text-muted-foreground">
              lịch hẹn đã được thanh toán
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khách hàng mới
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{newCustomersCount}</div>
            <p className="text-xs text-muted-foreground">
              khách hàng trong kỳ báo cáo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Biểu đồ Doanh thu --- */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Biểu đồ Doanh thu</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <RevenueOverTimeChart data={filteredInvoices} />
        </CardContent>
      </Card>
    </div>
  );
}
