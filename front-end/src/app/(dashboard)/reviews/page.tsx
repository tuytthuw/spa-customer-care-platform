"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReviewCard from "@/features/review/components/ServiceReviewCard";
import ReviewModal from "@/features/review/components/ReviewModal";
import TreatmentReviewCard from "@/features/review/components/TreatmentReviewCard";
import { Appointment } from "@/features/appointment/types";
import { TreatmentPackage } from "@/features/treatment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import { getCustomerTreatments } from "@/features/treatment/api/treatment.api";
import { getServices } from "@/features/service/api/service.api";
import { getStaff } from "@/features/staff/api/staff.api";
import { useAuth } from "@/contexts/AuthContexts";

const ReviewsPage = () => {
  const [selectedItem, setSelectedItem] = useState<
    Appointment | TreatmentPackage | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Fetch all necessary data
  const { data: appointments = [], isLoading: loadingAppts } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments", user?.id],
    queryFn: getAppointments,
    select: (data) =>
      data.filter(
        (a) => a.customerId === "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c"
      ), // Mocking customer Hằng
  });

  const { data: treatments = [], isLoading: loadingTreatments } = useQuery<
    TreatmentPackage[]
  >({
    queryKey: ["customerTreatments", user?.id],
    queryFn: getCustomerTreatments,
    select: (data) =>
      data.filter(
        (t) => t.customerId === "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c"
      ), // Mocking customer Hằng
  });

  const { data: services = [], isLoading: loadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { data: staff = [], isLoading: loadingStaff } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  const isLoading =
    loadingAppts || loadingTreatments || loadingServices || loadingStaff;

  const handleWriteReview = (item: Appointment | TreatmentPackage) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return <div className="p-8">Đang tải danh sách cần đánh giá...</div>;
  }

  const completedAppointments = appointments.filter(
    (appt) => appt.status === "completed"
  );

  const completedTreatments = treatments.filter(
    (pkg) => pkg.completedSessions === pkg.totalSessions
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
          item={selectedItem}
          services={services}
        />
      )}
    </div>
  );
};

export default ReviewsPage;
