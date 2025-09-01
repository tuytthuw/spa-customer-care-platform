"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReviewCard from "@/features/review/components/ServiceReviewCard";
import { ReviewModal } from "@/features/review/components/ReviewModal";
import TreatmentReviewCard from "@/features/review/components/TreatmentReviewCard";
import { Appointment } from "@/features/appointment/types";
import { TreatmentPackage, TreatmentPlan } from "@/features/treatment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import {
  getCustomerTreatments,
  getTreatmentPlans,
} from "@/features/treatment/api/treatment.api";
import { getServices } from "@/features/service/api/service.api";
import { getStaff } from "@/features/staff/api/staff.api";
import { useAuth } from "@/contexts/AuthContexts";
import { getCustomers } from "@/features/customer/api/customer.api";
import { NewReviewData, Review } from "@/features/review/types";
import { toast } from "sonner";
import { createReview, getReviews } from "@/features/review/api/review.api";
import { FullCustomerProfile } from "@/features/customer/types";

const ReviewsPage = () => {
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<
    Appointment | TreatmentPackage | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
  const currentUserProfile = customers.find((c) => c.userId === user?.id);
  const { data: appointments = [], isLoading: loadingAppts } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments", currentUserProfile?.id],
    queryFn: getAppointments,
    enabled: !!currentUserProfile,
    select: (data) =>
      data.filter((a) => a.customerId === currentUserProfile?.id),
  });

  const { data: treatments = [] } = useQuery<TreatmentPackage[]>({
    queryKey: ["customerTreatments", currentUserProfile?.id],
    queryFn: getCustomerTreatments,
    enabled: !!currentUserProfile,
    select: (data) =>
      data.filter((t) => t.customerId === currentUserProfile?.id),
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: getServices,
  });
  const { data: staff = [] } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });
  const { data: treatmentPlans = [] } = useQuery<TreatmentPlan[]>({
    queryKey: ["treatmentPlans"],
    queryFn: getTreatmentPlans,
  });

  // const isLoading =
  //   loadingAppts || loadingTreatments || loadingServices || loadingStaff;

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

  const completedAppointments = appointments.filter(
    (appt) => appt.status === "completed"
  );

  const completedTreatments = treatments.filter(
    (pkg) => pkg.completedSessions === pkg.totalSessions
  );

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!selectedItem || !currentUserProfile) return;
    let reviewData: NewReviewData | null = null;

    if ("serviceId" in selectedItem) {
      // Đây là Appointment
      if (!selectedItem.technicianId) return;
      reviewData = {
        appointmentId: selectedItem.id,
        customerId: currentUserProfile.id,
        technicianId: selectedItem.technicianId,
        serviceId: selectedItem.serviceId,
        rating,
        comment,
      };
    } else {
      // Đây là TreatmentPackage
      reviewData = {
        appointmentId: `pkg-${selectedItem.id}`,
        customerId: currentUserProfile.id,
        technicianId: "N/A",
        serviceId: selectedItem.treatmentPlanId,
        rating,
        comment,
      };
    }

    if (reviewData) {
      createReviewMutation.mutate(reviewData);
    }
  };
  const getSelectedItemName = () => {
    if (!selectedItem) return "";
    if ("serviceId" in selectedItem) {
      // Appointment
      return services.find((s) => s.id === selectedItem.serviceId)?.name || "";
    } else {
      // TreatmentPackage
      return (
        treatmentPlans.find((p) => p.id === selectedItem.treatmentPlanId)
          ?.name || ""
      );
    }
  };

  // --- BƯỚC 3: XỬ LÝ TRẠNG THÁI LOADING VÀ LỌC DỮ LIỆU ---
  const isLoading = loadingCustomers && !currentUserProfile;
  if (isLoading) return <div className="p-8">Đang tải...</div>;

  const appointmentsToReview = appointments.filter(
    (a) =>
      a.status === "completed" && !reviews.some((r) => r.appointmentId === a.id)
  );
  const treatmentsToReview = treatments.filter(
    (t) =>
      t.completedSessions === t.totalSessions &&
      !reviews.some((r) => r.appointmentId === `pkg-${t.id}`)
  );

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Đánh giá dịch vụ & Liệu trình</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Dịch vụ lẻ đã hoàn thành
        </h2>
        <div className="space-y-4">
          {completedAppointments.length > 0 ? (
            completedAppointments.map((appointment) => (
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
        <h2 className="text-2xl font-semibold mb-4">
          Liệu trình đã hoàn thành
        </h2>
        <div className="space-y-4">
          {completedTreatments.length > 0 ? (
            completedTreatments.map((pkg) => (
              <TreatmentReviewCard
                key={pkg.id}
                treatmentPackage={pkg}
                services={services}
                onWriteReview={() => handleWriteReview(pkg)}
              />
            ))
          ) : (
            <p className="text-muted-foreground">
              Bạn không có liệu trình nào đã hoàn thành để đánh giá.
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
