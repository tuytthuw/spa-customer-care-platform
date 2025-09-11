"use client";

import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/features/resource/api/resource.api";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import { getCustomers } from "@/features/customer/api/customer.api";
import { FullCustomerProfile } from "@/features/customer/types";
import { getStaff } from "@/features/staff/api/staff.api";
import ResourceCalendar from "@/features/resource/components/ResourceCalendar";
import { Appointment } from "@/features/appointment/types";
import { Resource } from "@/features/resource/types";
import { Staff } from "@/features/staff/types";
import { PageHeader } from "@/components/common/PageHeader";

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
      <PageHeader
        title="Lịch trình Tổng thể"
        description="Quản lý lịch hẹn theo Kỹ thuật viên, Phòng và Thiết bị."
      />
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
