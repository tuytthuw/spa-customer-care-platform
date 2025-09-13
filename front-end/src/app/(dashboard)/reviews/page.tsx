"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContexts";
import { toast } from "sonner";

// Import các types cần thiết
import { Appointment } from "@/features/appointment/types";
import { TreatmentPackage } from "@/features/treatment/types";
import { NewReviewData } from "@/features/review/types";
import { ReviewFormValues } from "@/features/review/schemas";

// Import các API actions
import { createReview } from "@/features/review/api/review.api";

// Import các custom hooks
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useAppointments } from "@/features/appointment/hooks/useAppointments";
import { useServices } from "@/features/service/hooks/useServices";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useReviews } from "@/features/review/hooks/useReviews";
import { useTreatments } from "@/features/treatment/hooks/useTreatments";
import { useTreatmentPlans } from "@/features/treatment/hooks/useTreatmentPlans";

// Import các components UI
import ReviewCard from "@/features/review/components/ServiceReviewCard";
import TreatmentReviewCard from "@/features/review/components/TreatmentReviewCard";
import { ReviewModal } from "@/features/review/components/ReviewModal";
import { PageHeader } from "@/components/common/PageHeader";
import { FullPageLoader } from "@/components/ui/spinner";

const ReviewsPage = () => {
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<
    Appointment | TreatmentPackage | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Sử dụng các custom hooks để lấy dữ liệu
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const { data: appointments = [], isLoading: loadingAppts } =
    useAppointments();
  const { data: treatments = [], isLoading: loadingTreatments } =
    useTreatments();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: staff = [], isLoading: loadingStaff } = useStaffs();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();
  const { data: treatmentPlans = [], isLoading: loadingPlans } =
    useTreatmentPlans();

  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      closeModal();
    },
    onError: (error) => toast.error(`Gửi đánh giá thất bại: ${error.message}`),
  });

  const handleWriteReview = (item: Appointment | TreatmentPackage) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleReviewSubmit = (data: ReviewFormValues) => {
    if (!selectedItem || !currentUserProfile) return;

    let reviewData: NewReviewData | null = null;

    if ("date" in selectedItem) {
      // Đây là Appointment
      if (!selectedItem.technicianId) return;
      reviewData = {
        appointmentId: selectedItem.id,
        customerId: currentUserProfile.id,
        technicianId: selectedItem.technicianId,
        serviceId: selectedItem.serviceId,
        rating: data.rating,
        comment: data.comment,
      };
    } else {
      // Đây là TreatmentPackage
      reviewData = {
        appointmentId: `pkg-${selectedItem.id}`,
        customerId: currentUserProfile.id,
        technicianId: "N/A",
        serviceId: selectedItem.treatmentPlanId,
        rating: data.rating,
        comment: data.comment,
      };
    }

    if (reviewData) {
      createReviewMutation.mutate(reviewData);
    }
  };

  const getSelectedItemName = () => {
    if (!selectedItem) return "";
    if ("serviceId" in selectedItem && "date" in selectedItem) {
      // Appointment
      return services.find((s) => s.id === selectedItem.serviceId)?.name || "";
    } else if ("treatmentPlanId" in selectedItem) {
      // TreatmentPackage
      return (
        treatmentPlans.find((p) => p.id === selectedItem.treatmentPlanId)
          ?.name || ""
      );
    }
    return "";
  };

  // --- SỬA LỖI Ở ĐÂY: XỬ LÝ TRẠNG THÁI LOADING VÀ LỌC DỮ LIỆU ---
  const isLoading =
    loadingCustomers ||
    loadingAppts ||
    loadingTreatments ||
    loadingServices ||
    loadingStaff ||
    loadingReviews ||
    loadingPlans;

  if (isLoading) return <FullPageLoader text="Đang tải dữ liệu đánh giá..." />;

  const appointmentsToReview = appointments.filter(
    (a) =>
      a.customerId === currentUserProfile?.id &&
      a.status === "completed" &&
      !reviews.some((r) => r.appointmentId === a.id)
  );

  const treatmentsToReview = treatments.filter((pkg) => {
    const plan = treatmentPlans.find((p) => p.id === pkg.treatmentPlanId);
    if (!plan) return false;

    const completedCount = pkg.sessions.filter(
      (s) => s.status === "completed"
    ).length;

    const isTreatmentCompleted = completedCount === plan.totalSessions;
    const hasReviewed = reviews.some(
      (r) => r.appointmentId === `pkg-${pkg.id}`
    );

    return isTreatmentCompleted && !hasReviewed;
  });

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Đánh giá dịch vụ & Liệu trình" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Dịch vụ lẻ cần đánh giá</h2>
        <div className="space-y-4">
          {appointmentsToReview.length > 0 ? (
            appointmentsToReview.map((appointment) => (
              <ReviewCard
                key={appointment.id}
                appointment={appointment}
                services={services}
                staff={staff}
                onWriteReview={() => handleWriteReview(appointment)}
              />
            ))
          ) : (
            <p className="text-muted-foreground">
              Bạn không có dịch vụ lẻ nào cần đánh giá.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Liệu trình cần đánh giá</h2>
        <div className="space-y-4">
          {treatmentsToReview.length > 0 ? (
            treatmentsToReview.map((pkg) => {
              // ✅ SỬA Ở ĐÂY: Tìm plan tương ứng
              const plan = treatmentPlans.find(
                (p) => p.id === pkg.treatmentPlanId
              );
              return (
                <TreatmentReviewCard
                  key={pkg.id}
                  treatmentPackage={pkg}
                  treatmentPlan={plan} // Truyền plan vào
                  onWriteReview={() => handleWriteReview(pkg)}
                />
              );
            })
          ) : (
            <p className="text-muted-foreground">
              Bạn không có liệu trình nào cần đánh giá.
            </p>
          )}
        </div>
      </section>

      {selectedItem && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleReviewSubmit}
          itemName={getSelectedItemName()}
          isSubmitting={createReviewMutation.isPending}
        />
      )}
    </div>
  );
};

export default ReviewsPage;
