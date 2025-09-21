// src/app/(dashboard)/schedule/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContexts";

// Import các hooks để fetch dữ liệu
import { useCustomers } from "@/features/customer/hooks/useCustomers";
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Appointment } from "@/features/appointment/types";
import { ReviewModal } from "@/features/review/components/ReviewModal";
import {
  getAppointmentsByCustomerId,
  updateAppointmentStatus,
} from "@/features/appointment/api/appointment.api";
import { createReview } from "@/features/review/api/review.api";
import { NewReviewData } from "@/features/review/types";
import { ReviewFormValues } from "@/features/review/schemas";

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] =
    useState<Appointment | null>(null);

  // Fetch toàn bộ dữ liệu ở component cha
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  const { data: appointments = [], isLoading: loadingAppts } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments", { customerId: currentUserProfile?.id }],
    queryFn: () => getAppointmentsByCustomerId(currentUserProfile!.id),
    enabled: !!currentUserProfile,
  });
  const { data: treatments = [], isLoading: loadingTreatments } =
    useTreatments();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: treatmentPlans = [], isLoading: loadingPlans } =
    useTreatmentPlans();
  const { data: staff = [], isLoading: loadingStaff } = useStaffs();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();

  // Mutation để hủy lịch hẹn
  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => {
      console.log(`Cancelling appointment ${id} for reason: ${reason}`);
      return updateAppointmentStatus(id, "cancelled");
    },
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

  // Mutation để tạo đánh giá
  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      setIsReviewModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Gửi đánh giá thất bại: ${error.message}`);
    },
  });

  const handleCancelAppointment = (id: string, reason: string) => {
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
        <ScheduleListView
          {...scheduleDataProps}
          onCancelAppointment={handleCancelAppointment}
          onWriteReview={handleOpenReviewModal}
        />
      ) : (
        <ScheduleCalendarView
          {...scheduleDataProps}
          onCancelAppointment={handleCancelAppointment}
          onWriteReview={handleOpenReviewModal}
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
