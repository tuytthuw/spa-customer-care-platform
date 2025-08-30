"use client";

import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/services/resource.api";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import {
  getCustomers,
  FullCustomerProfile,
} from "@/features/customer/api/customer.api";
import { getStaff } from "@/services/staff.api";
import ResourceCalendar from "@/features/resource/components/ResourceCalendar";
import { Appointment } from "@/types/appointment";
import { Resource } from "@/types/resource";
import { Staff } from "@/types/staff";

export default function ResourceSchedulePage() {
  // Fetch tất cả dữ liệu cần thiết
  const { data: resources = [], isLoading: loadingResources } = useQuery<
    Resource[]
  >({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: staff = [], isLoading: loadingStaff } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  const isLoading =
    loadingResources || loadingAppointments || loadingCustomers || loadingStaff;

  if (isLoading) {
    return <div className="p-8">Đang tải dữ liệu lịch trình...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Lịch trình Tổng thể</h1>
        <p className="text-muted-foreground">
          Quản lý lịch hẹn theo Kỹ thuật viên, Phòng và Thiết bị.
        </p>
      </div>
      {/* Đặt chiều cao cho calendar để nó hiển thị đúng */}
      <div className="h-[75vh]">
        <ResourceCalendar
          resources={resources}
          appointments={appointments}
          customers={customers}
          staff={staff}
        />
      </div>
    </div>
  );
}
