"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StatisticsSidebar } from "@/features/appointment/components/appointment-management/StatisticsSidebar";
import { AppointmentTimeline } from "@/features/appointment/components/appointment-management/AppointmentTimeline";
import { AppointmentDetails } from "@/features/appointment/components/appointment-management/AppointmentDetails";
import { Appointment, AppointmentStatus } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import {
  getAppointments,
  updateAppointmentStatus,
  updateAppointmentDetails,
} from "@/features/appointment/api/appointment.api";
import { getCustomers } from "@/features/customer/api/customer.api";
import { getServices } from "@/features/service/api/service.api";
import { getStaff } from "@/features/staff/api/staff.api";
import { toast } from "sonner";
import { EventDropArg } from "@fullcalendar/core";
import { cn } from "@/lib/utils";

export default function AppointmentsManagementPage() {
  const queryClient = useQueryClient();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  // --- Fetch tất cả dữ liệu cần thiết từ API ---
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

  const { data: staff = [], isLoading: loadingStaff } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  // --- Mutation để cập nhật trạng thái ---
  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      newStatus,
    }: {
      id: string;
      newStatus: AppointmentStatus;
    }) => updateAppointmentStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (error) => {
      toast.error(`Cập nhật thất bại: ${error.message}`);
    },
  });

  // Mutation xử lý kéo-thả**
  const updateDetailsMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Appointment, "date" | "technicianId">>;
    }) => updateAppointmentDetails(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Cập nhật lịch hẹn thành công!");
    },
    onError: (error) => {
      toast.error(`Cập nhật thất bại: ${error.message}`);
    },
  });

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  // **MỚI: Hàm xử lý sự kiện khi kéo-thả lịch hẹn**
  const handleEventDrop = (info: EventDropArg) => {
    const { event } = info;
    const updates: Partial<Pick<Appointment, "date" | "technicianId">> = {};

    if (event.start) {
      updates.date = event.start.toISOString();
    }

    // `newResource` chỉ tồn tại trong các view resource, nếu bạn dùng nó
    // if (info.newResource) {
    //   updates.technicianId = info.newResource.id;
    // }

    console.log(`Updating appointment ${event.id} with`, updates);
    updateDetailsMutation.mutate({ id: event.id, updates });
  };

  const selectedAppointment =
    appointments.find((app) => app.id === selectedAppointmentId) || null;

  // Xử lý trạng thái loading chung
  if (
    loadingAppointments ||
    loadingCustomers ||
    loadingServices ||
    loadingStaff
  ) {
    return <div className="p-8">Đang tải dữ liệu trang quản lý...</div>;
  }

  return (
    <div className="flex h-full bg-muted/30">
      <StatisticsSidebar appointments={appointments} staff={staff} />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          selectedAppointment ? "w-[calc(100%-24rem-16rem)]" : "w-full"
        )}
      >
        <AppointmentTimeline
          appointments={appointments}
          customers={customers}
          services={services}
          onSelectAppointment={(app) => setSelectedAppointmentId(app.id)}
          staff={staff}
          onEventDrop={handleEventDrop}
        />
      </div>

      {selectedAppointment && (
        <AppointmentDetails
          key={selectedAppointment.id} // Thêm key để component re-render khi chọn lịch hẹn khác
          appointment={selectedAppointment}
          customers={customers}
          services={services}
          staff={staff}
          onStatusChange={handleStatusChange}
          onClose={() => setSelectedAppointmentId(null)} // Thêm hàm để đóng chi tiết
        />
      )}
    </div>
  );
}
