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
import { getStaffProfiles } from "@/features/staff/api/staff.api";
import { FullStaffProfile } from "@/features/staff/types";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";

export default function TechnicianDashboard() {
  const { user } = useAuth(); // Lấy thông tin user đang đăng nhập

  const { data: staffProfiles = [], isLoading: loadingStaff } = useQuery<
    FullStaffProfile[]
  >({
    queryKey: ["staffProfiles"],
    queryFn: getStaffProfiles,
    enabled: !!user, // Chỉ fetch khi có user
  });

  const currentTechnician = staffProfiles.find((s) => s.userId === user?.id);

  // Fetch tất cả dữ liệu cần thiết
  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments", "technician", currentTechnician?.id],
    queryFn: getAppointments,
    enabled: !!currentTechnician, // ✅ CHỈ FETCH KHI ĐÃ CÓ THÔNG TIN KTV
    // ✅ TỐI ƯU: Lọc dữ liệu ngay sau khi fetch bằng `select`
    select: (data) => {
      if (!currentTechnician) return [];
      const today = new Date().toDateString();
      // Lọc lịch hẹn của đúng kỹ thuật viên này và trong ngày hôm nay
      return data.filter(
        (app) =>
          app.technicianId === currentTechnician.id &&
          new Date(app.date).toDateString() === today
      );
    },
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

  const isLoading =
    loadingStaff || loadingAppointments || loadingCustomers || loadingServices;

  const today = new Date();
  const dateString = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return <FullPageLoader text="Đang tải lịch hẹn hôm nay..." />;
  }

  // Lọc các lịch hẹn cho kỹ thuật viên đang đăng nhập và trong ngày hôm nay
  const todaysAppointments = appointments;

  // Tính toán thống kê từ dữ liệu thật
  const totalCustomers = todaysAppointments.length;
  const inProgressCount = todaysAppointments.filter(
    (a) => a.status === "in-progress"
  ).length;
  const completedCount = todaysAppointments.filter(
    (a) => a.status === "completed"
  ).length;

  return (
    <main className="bg-muted min-h-screen -m-4 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <h2 className="text-xl text-foreground">Lịch Hẹn Hôm Nay</h2>
              <div className="text-base sm:text-lg text-muted-foreground">
                {dateString}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl text-foreground">{totalCustomers}</div>
                <div className="text-sm text-muted-foreground">
                  Tổng khách hàng
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl text-foreground">
                  {inProgressCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Đang thực hiện
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl text-foreground">{completedCount}</div>
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
