"use client";

import TodaysAppointmentCard from "@/features/dashboard/components/TodaysAppointmentCard";
import { useQuery } from "@tanstack/react-query";
import { Appointment } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import { getCustomers } from "@/features/customer/api/customer.api";
import { getServices } from "@/features/service/api/service.api";
import { useAuth } from "@/contexts/AuthContexts";

export default function TechnicianDashboard() {
  const { user } = useAuth(); // Lấy thông tin user đang đăng nhập

  // Fetch tất cả dữ liệu cần thiết
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

  const { data: services = [], isLoading: loadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const isLoading = loadingAppointments || loadingCustomers || loadingServices;

  const today = new Date();
  const dateString = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-xl text-foreground mb-4">
          Đang tải lịch hẹn hôm nay...
        </h2>
      </div>
    );
  }

  // Lọc các lịch hẹn cho kỹ thuật viên đang đăng nhập và trong ngày hôm nay
  const todaysAppointments = appointments.filter((app) => {
    const appDate = new Date(app.date);
    // Giả sử userId của staff và technicianId trong appointment là giống nhau
    // Trong thực tế, có thể cần Abstraction Layer tốt hơn
    return (
      app.technicianId === user?.id &&
      appDate.toDateString() === today.toDateString()
    );
  });

  // Tính toán thống kê từ dữ liệu thật
  const totalCustomers = todaysAppointments.length;
  const inProgressCount = todaysAppointments.filter(
    (a) => a.status === "in-progress"
  ).length;
  const completedCount = todaysAppointments.filter(
    (a) => a.status === "completed"
  ).length;

  return (
    <main className="bg-muted min-h-screen -m-6 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-foreground">Lịch Hẹn Hôm Nay</h2>
              <div className="text-lg text-muted-foreground">{dateString}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl text-muted-foreground">
                  {totalCustomers}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tổng khách hàng
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl text-muted-foreground">
                  {inProgressCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Đang thực hiện
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl text-muted-foreground">
                  {completedCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Đã hoàn thành
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {todaysAppointments.length > 0 ? (
            todaysAppointments.map((appointment) => {
              const customer = customers.find(
                (c) => c.id === appointment.customerId
              );
              const service = services.find(
                (s) => s.id === appointment.serviceId
              );
              if (!customer || !service) return null;

              return (
                <TodaysAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  customer={customer}
                  service={service}
                />
              );
            })
          ) : (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 text-center">
              <p>Bạn không có lịch hẹn nào hôm nay.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
