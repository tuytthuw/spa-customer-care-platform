// src/app/(dashboard)/schedule/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCustomerScheduleData } from "@/features/customer-schedules/hooks/useCustomerScheduleData";

// Import components và types
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/features/shared/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import ScheduleListView from "@/features/customer-schedules/components/ScheduleListView";
import ScheduleCalendarView from "@/features/customer-schedules/components/ScheduleCalendarView";
import { ReviewModal } from "@/features/review/components/ReviewModal";
import { Appointment } from "@/features/appointment/types";
import { ReviewFormValues } from "@/features/review/schemas";
import { NewReviewData } from "@/features/review/types";
import {
  updateAppointmentStatus,
  createAppointment,
} from "@/features/appointment/api/appointment.api";
import { createReview } from "@/features/review/api/review.api";
import useBookingStore from "@/stores/booking-store";

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] =
    useState<Appointment | null>(null);

  const { isLoading, data: scheduleData } = useCustomerScheduleData();
  const { currentUserProfile, services } = scheduleData;

  const handleNavigateToBooking = (date?: Date) => {
    let url = "/booking";
    if (date) {
      // Format ngày thành YYYY-MM-DD để truyền qua URL
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      url += `?date=${formattedDate}`;
    }
    router.push(url);
  };

  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      updateAppointmentStatus(id, "cancelled", reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", { customerId: currentUserProfile?.id }],
      });
      toast.success("Đã hủy lịch hẹn thành công.");
    },
    onError: (error) => toast.error(`Hủy lịch thất bại: ${error.message}`),
  });

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      setIsReviewModalOpen(false);
    },
    onError: (error) => toast.error(`Gửi đánh giá thất bại: ${error.message}`),
  });

  const handleCancelAppointment = (id: string, reason: string) => {
    console.log(`Cancelling appointment ${id} with reason: ${reason}`); // Để debug
    cancelAppointmentMutation.mutate({ id, reason });
  };

  const handleOpenReviewModal = (appointment: Appointment) => {
    setSelectedAppointmentForReview(appointment);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (values: ReviewFormValues) => {
    if (
      !selectedAppointmentForReview ||
      !currentUserProfile ||
      !selectedAppointmentForReview.technicianId
    ) {
      toast.error("Thiếu thông tin để gửi đánh giá.");
      return;
    }

    const reviewData: NewReviewData = {
      appointmentId: selectedAppointmentForReview.id,
      customerId: currentUserProfile.id,
      technicianId: selectedAppointmentForReview.technicianId,
      serviceId: selectedAppointmentForReview.serviceId,
      rating: values.rating,
      comment: values.comment,
    };
    createReviewMutation.mutate(reviewData);
  };

  if (isLoading) {
    return <FullPageLoader text="Đang tải lịch trình của bạn..." />;
  }

  if (!currentUserProfile) {
    return <div className="p-6">Không tìm thấy thông tin khách hàng.</div>;
  }
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
        <ScheduleListView
          {...scheduleData}
          currentUserProfile={currentUserProfile}
          onCancelAppointment={handleCancelAppointment}
          onWriteReview={handleOpenReviewModal}
          onCreateAppointment={() => handleNavigateToBooking()}
        />
      ) : (
        <ScheduleCalendarView
          {...scheduleData}
          currentUserProfile={currentUserProfile}
          onCancelAppointment={handleCancelAppointment}
          onWriteReview={handleOpenReviewModal}
          onCreateAppointment={handleNavigateToBooking}
        />
      )}

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        itemName={
          services.find((s) => s.id === selectedAppointmentForReview?.serviceId)
            ?.name || "Dịch vụ"
        }
        isSubmitting={createReviewMutation.isPending}
      />
    </div>
  );
}
