"use client";

import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Hooks
import { useAppointments } from "@/features/appointment/hooks/useAppointments";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useServices } from "@/features/service/hooks/useServices";

// API
import { updateAppointmentStatus } from "@/features/appointment/api/appointment.api";

// Components
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import CheckInList from "@/features/appointment/components/appointment-management/CheckInList";
import { Button } from "@/features/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";

// API function for bulk update (sẽ cần tạo ở file api)
const bulkUpdateAppointmentStatus = async (appointmentIds: string[]) => {
  return Promise.all(
    appointmentIds.map((id) => updateAppointmentStatus(id, "checked-in"))
  );
};

export default function BulkCheckInPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: appointments = [], isLoading: loadingAppointments } =
    useAppointments();
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const { data: services = [], isLoading: loadingServices } = useServices();

  const isLoading = loadingAppointments || loadingCustomers || loadingServices;

  const todaysUpcomingAppointments = useMemo(() => {
    const today = new Date().toDateString();
    return appointments
      .filter(
        (app) =>
          app.status === "upcoming" &&
          new Date(app.date).toDateString() === today
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appointments]);

  const bulkCheckInMutation = useMutation({
    mutationFn: bulkUpdateAppointmentStatus,
    onSuccess: () => {
      toast.success("Check-in hàng loạt thành công!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      router.push("/manage-appointments");
    },
    onError: (error) => {
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
    },
  });

  if (isLoading) {
    return <FullPageLoader text="Đang tải danh sách check-in..." />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>
      <PageHeader
        title="Check-in Hàng Loạt"
        description="Chọn các lịch hẹn của khách đã đến và xác nhận check-in."
      />
      <CheckInList
        appointments={todaysUpcomingAppointments}
        customers={customers}
        services={services}
        onBulkCheckIn={(ids) => bulkCheckInMutation.mutate(ids)}
        isSubmitting={bulkCheckInMutation.isPending}
      />
    </div>
  );
}
