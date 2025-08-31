"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@/features/appointment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/features/appointment/components/my-appointments/AppointmentCard";
import {
  getAppointments,
  updateAppointmentStatus,
} from "@/features/appointment/api/appointment.api";
import { getServices } from "@/features/service/api/service.api";
import { getStaff } from "@/features/staff/api/staff.api";
import { useAuth } from "@/contexts/AuthContexts";
import { toast } from "sonner";

export default function CustomerDashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // 1. Fetch tất cả dữ liệu cần thiết
  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments", user?.id], // Lọc theo ID của user
    queryFn: getAppointments,
    // Lọc phía client để chỉ lấy lịch hẹn của user đang đăng nhập
    select: (data) =>
      data.filter(
        (app) => app.customerId === "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c"
      ), // GIẢ LẬP: Lấy customerId của "Trần Thị Bích Hằng"
  });

  const { data: services = [], isLoading: loadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { data: staff = [], isLoading: loadingStaff } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  // 2. Tạo mutation để hủy lịch
  const cancelAppointmentMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      updateAppointmentStatus(appointmentId, "cancelled"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", user?.id] });
      toast.success("Đã hủy lịch hẹn thành công.");
    },
    onError: (error) => {
      toast.error(`Hủy lịch thất bại: ${error.message}`);
    },
  });

  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointmentMutation.mutate(appointmentId);
  };

  const isLoading = loadingAppointments || loadingServices || loadingStaff;

  if (isLoading) return <div className="p-6">Đang tải lịch hẹn...</div>;
  // Không cần xử lý lỗi ở đây vì các hàm API đã trả về mảng rỗng

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "upcoming"
  );
  const pastAppointments = appointments.filter((a) => a.status !== "upcoming");

  // Hàm render danh sách để tránh lặp code
  const renderAppointmentList = (list: Appointment[]) => {
    if (list.length === 0) {
      return <p className="text-muted-foreground">Không có lịch hẹn nào.</p>;
    }
    return list.map((appointment) => {
      const service = services.find((s) => s.id === appointment.serviceId);
      const technician = staff.find((t) => t.id === appointment.technicianId);

      if (!service) return null; // Không render nếu không có thông tin dịch vụ

      return (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          service={service}
          technician={technician}
          onCancel={handleCancelAppointment}
        />
      );
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lịch hẹn của tôi</h1>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <div className="space-y-4">
            {renderAppointmentList(upcomingAppointments)}
          </div>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <div className="space-y-4">
            {renderAppointmentList(pastAppointments)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
