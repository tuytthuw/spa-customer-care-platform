"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@/types/appointment";
import { Service } from "@/types/service";
import { Staff } from "@/types/staff";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/features/appointment/AppointmentCard";
import {
  getAppointments,
  updateAppointmentStatus, // Giả sử bạn sẽ tạo hàm này
} from "@/services/appointmentService";
import { getServices } from "@/services/serviceService";
import { getStaff } from "@/services/staffService";
import { toast } from "sonner";

export default function AppointmentsPage() {
  const queryClient = useQueryClient();

  // 1. Fetch tất cả dữ liệu cần thiết: appointments, services, và staff
  const {
    data: appointments = [],
    isLoading: isLoadingAppointments,
    error: errorAppointments,
  } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const {
    data: services = [],
    isLoading: isLoadingServices,
    error: errorServices,
  } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const {
    data: staff = [],
    isLoading: isLoadingStaff,
    error: errorStaff,
  } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  // 2. Sử dụng useMutation để xử lý việc cập nhật trạng thái
  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "cancelled" }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      // Làm mới lại query "appointments" để cập nhật UI
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Hủy lịch hẹn thành công!");
    },
    onError: (error) => {
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
    },
  });

  // 3. Cập nhật hàm xử lý để gọi mutation
  const handleCancelAppointment = (id: string, reason: string) => {
    console.log(`Cancelling appointment ${id} for reason: ${reason}`);
    cancelAppointmentMutation.mutate({ id, status: "cancelled" });
  };

  // 4. Gộp các trạng thái loading và error
  const isLoading =
    isLoadingAppointments || isLoadingServices || isLoadingStaff;
  const error = errorAppointments || errorServices || errorStaff;

  if (isLoading) {
    return <div className="p-8">Đang tải lịch hẹn của bạn...</div>;
  }

  if (error) {
    return (
      <div className="p-8">Đã xảy ra lỗi khi tải dữ liệu: {error.message}</div>
    );
  }

  // Lọc dữ liệu sau khi đã fetch xong
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "upcoming"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled"
  );

  // Hàm render danh sách lịch hẹn để tránh lặp code
  const renderAppointmentList = (list: Appointment[]) => {
    if (list.length === 0) {
      return <p>Không có lịch hẹn nào.</p>;
    }
    return list.map((appointment) => {
      // 5. Tìm kiếm service và technician từ dữ liệu đã fetch
      const service = services.find((s) => s.id === appointment.serviceId);
      const technician = staff.find((t) => t.id === appointment.technicianId);

      // Chỉ render khi có đủ thông tin dịch vụ
      if (!service) return null;

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
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Lịch hẹn của tôi</h1>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Sắp tới ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã hoàn thành ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Đã hủy ({cancelledAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="space-y-4">{renderAppointmentList(upcomingAppointments)}</div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div className="space-y-4">{renderAppointmentList(completedAppointments)}</div>
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <div className="space-y-4">{renderAppointmentList(cancelledAppointments)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}