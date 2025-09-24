"use client";

import ResourceCalendar from "@/features/resource/components/ResourceCalendar";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useAppointments } from "@/features/appointment/hooks/useAppointments";
import { useResources } from "@/features/resource/hooks/useResources";

export default function ResourceSchedulePage() {
  // Fetch tất cả dữ liệu cần thiết
  const { data: resources = [], isLoading: loadingResources } = useResources();

  const { data: appointments = [], isLoading: loadingAppointments } =
    useAppointments();

  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();

  const { data: staff = [], isLoading: loadingStaff } = useStaffs();

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
