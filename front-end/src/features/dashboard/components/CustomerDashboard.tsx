// src/features/dashboard/components/CustomerDashboard.tsx

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@/features/appointment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/features/appointment/components/my-appointments/AppointmentCard";
import {
  getAppointmentsByCustomerId,
  updateAppointmentStatus,
} from "@/features/appointment/api/appointment.api";
import { getServices } from "@/features/service/api/service.api";
import { getStaff } from "@/features/staff/api/staff.api";
import { useAuth } from "@/contexts/AuthContexts";
import { toast } from "sonner";
import { getCustomers } from "@/features/customer/api/customer.api";
import { FullCustomerProfile } from "@/features/customer/types";

export default function CustomerDashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ✅ BƯỚC 1: Lấy danh sách khách hàng để tìm profile của user hiện tại
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled: !!user,
  });

  // Tìm customer profile tương ứng với user đang đăng nhập
  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  // ✅ BƯỚC 2: Fetch lịch hẹn chỉ cho khách hàng hiện tại
  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments", { customerId: currentUserProfile?.id }],
    queryFn: () => getAppointmentsByCustomerId(currentUserProfile!.id),
    // Chỉ fetch khi đã tìm thấy profile của khách hàng
    enabled: !!currentUserProfile,
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

  const cancelAppointmentMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      updateAppointmentStatus(appointmentId, "cancelled"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", { customerId: currentUserProfile?.id }],
      });
      toast.success("Đã hủy lịch hẹn thành công.");
    },
    onError: (error) => {
      toast.error(`Hủy lịch thất bại: ${error.message}`);
    },
  });

  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointmentMutation.mutate(appointmentId);
  };

  const isLoading =
    loadingCustomers || loadingAppointments || loadingServices || loadingStaff;

  if (isLoading) return <div className="p-6">Đang tải lịch hẹn...</div>;

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "upcoming"
  );
  const pastAppointments = appointments.filter((a) => a.status !== "upcoming");

  const renderAppointmentList = (list: Appointment[]) => {
    if (list.length === 0) {
      return <p className="text-muted-foreground">Không có lịch hẹn nào.</p>;
    }
    return list.map((appointment) => {
      const service = services.find((s) => s.id === appointment.serviceId);
      const technician = staff.find((t) => t.id === appointment.technicianId);

      if (!service) return null;

      return (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          service={service}
          technician={technician}
          onCancel={handleCancelAppointment}
          // Các props onReview và hasReviewed giữ nguyên
          onReview={() => {}}
          hasReviewed={false}
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
