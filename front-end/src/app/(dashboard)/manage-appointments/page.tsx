"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StatisticsSidebar from "@/features/appointment/components/appointment-management/StatisticsSidebar";
import { AppointmentTimeline } from "@/features/appointment/components/appointment-management/AppointmentTimeline";
import { AppointmentDetails } from "@/features/appointment/components/appointment-management/AppointmentDetails";
import { Appointment, AppointmentStatus } from "@/features/appointment/types";
import {
  updateAppointmentStatus,
  updateAppointmentDetails,
} from "@/features/appointment/api/appointment.api";
import { toast } from "sonner";
import { EventDropArg } from "@fullcalendar/core";
import { useAppointments } from "@/features/appointment/hooks/useAppointments";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useServices } from "@/features/service/hooks/useServices";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { Button } from "@/features/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/features/shared/components/ui/sheet";
import { BarChart2 } from "lucide-react";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";

function createAppointment(variables: void): Promise<unknown> {
  throw new Error("Function not implemented.");
}

export default function AppointmentsManagementPage() {
  const queryClient = useQueryClient();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // --- Fetch tất cả dữ liệu cần thiết từ API ---
  const { data: appointments = [], isLoading: loadingAppointments } =
    useAppointments();
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: staff = [], isLoading: loadingStaff } = useStaffs();

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
      updates: Partial<
        Pick<Appointment, "start" | "end" | "technicianId" | "resourceId">
      >;
    }) => updateAppointmentDetails(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Cập nhật lịch hẹn thành công!");
    },
    onError: (error) => {
      toast.error(`Cập nhật thất bại: ${error.message}`);
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment, // Giả sử bạn có hàm createAppointment trong api
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Tạo lịch hẹn thành công!");
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Tạo lịch hẹn thất bại: ${error.message}`);
    },
  });

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  const handleEventDrop = (info: EventDropArg) => {
    const { event } = info;
    const updates: Partial<
      Pick<Appointment, "start" | "end" | "technicianId" | "resourceId">
    > = {
      start: event.start?.toISOString(),
      end: event.end?.toISOString(),
      technicianId: event.getResources()[0]?.id,
      resourceId: event.getResources()[0]?.id,
    };
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
    return <FullPageLoader />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col h-screen">
      <PageHeader
        title="Quản lý Lịch hẹn"
        actionNode={
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <BarChart2 className="mr-2 h-4 w-4" />
                Thống kê
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <StatisticsSidebar
                appointments={appointments}
                staff={staff}
                onStaffSelect={setSelectedStaffId}
                selectedStaffId={selectedStaffId}
              />
            </SheetContent>
          </Sheet>
        }
      />

      <div className="flex-1 grid lg:grid-cols-[1fr_320px] gap-6 min-h-0">
        {/* Main Content: Timeline */}
        <div className="flex flex-col h-full min-h-[600px] lg:min-h-full">
          <AppointmentTimeline
            appointments={appointments}
            customers={customers}
            services={services}
            onSelectAppointment={(app) => setSelectedAppointmentId(app.id)}
            staff={staff}
            onEventDrop={handleEventDrop}
          />
        </div>

        {/* Sidebar: Details & Statistics */}
        <div className="hidden lg:flex flex-col gap-6">
          <StatisticsSidebar
            appointments={appointments}
            staff={staff}
            onStaffSelect={setSelectedStaffId}
            selectedStaffId={selectedStaffId}
          />
          {selectedAppointment && (
            <AppointmentDetails
              key={selectedAppointment.id}
              appointment={selectedAppointment}
              customers={customers}
              services={services}
              staff={staff}
              onStatusChange={handleStatusChange}
              onClose={() => setSelectedAppointmentId(null)}
            />
          )}
        </div>
      </div>

      {/* Mobile (Sheet for Details) */}
      <Sheet
        open={!!selectedAppointment}
        onOpenChange={(isOpen) => !isOpen && setSelectedAppointmentId(null)}
      >
        <SheetContent className="lg:hidden p-0 w-full max-w-sm">
          {selectedAppointment && (
            <AppointmentDetails
              key={selectedAppointment.id}
              appointment={selectedAppointment}
              customers={customers}
              services={services}
              staff={staff}
              onStatusChange={handleStatusChange}
              onClose={() => setSelectedAppointmentId(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
