// src/app/(dashboard)/schedule/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContexts";

// Import các hooks để fetch dữ liệu
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useAppointments } from "@/features/appointment/hooks/useAppointments";
import { useTreatments } from "@/features/treatment/hooks/useTreatments";
import { useServices } from "@/features/service/hooks/useServices";
import { useTreatmentPlans } from "@/features/treatment/hooks/useTreatmentPlans";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useReviews } from "@/features/review/hooks/useReviews";

// Import components cần thiết
import { PageHeader } from "@/components/common/PageHeader";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";
import { FullPageLoader } from "@/components/ui/spinner";
import ScheduleListView from "@/features/customer-schedules/components/ScheduleListView"; // Sẽ tạo ở bước sau
import ScheduleCalendarView from "@/features/customer-schedules//components/ScheduleCalendarView"; // Sẽ tạo ở bước sau

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const { user } = useAuth();

  // Fetch toàn bộ dữ liệu ở component cha
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const { data: appointments = [], isLoading: loadingAppts } =
    useAppointments();
  const { data: treatments = [], isLoading: loadingTreatments } =
    useTreatments();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: treatmentPlans = [], isLoading: loadingPlans } =
    useTreatmentPlans();
  const { data: staff = [], isLoading: loadingStaff } = useStaffs();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();

  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  const isLoading =
    loadingCustomers ||
    loadingAppts ||
    loadingTreatments ||
    loadingServices ||
    loadingPlans ||
    loadingStaff ||
    loadingReviews;

  if (isLoading) {
    return <FullPageLoader text="Đang tải lịch trình của bạn..." />;
  }

  if (!currentUserProfile) {
    return <div className="p-6">Không tìm thấy thông tin khách hàng.</div>;
  }

  const scheduleDataProps = {
    customers,
    appointments,
    treatments,
    services,
    treatmentPlans,
    staff,
    reviews,
    currentUserProfile,
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 h-full flex flex-col">
      <PageHeader
        title="Lịch trình của tôi"
        actionNode={
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => {
              if (value) setViewMode(value as "list" | "calendar");
            }}
          >
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="calendar" aria-label="Calendar view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        }
      />

      {viewMode === "list" ? (
        <ScheduleListView {...scheduleDataProps} />
      ) : (
        <ScheduleCalendarView {...scheduleDataProps} />
      )}
    </div>
  );
}
