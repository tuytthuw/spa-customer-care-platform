"use client";

import { useState } from "react";
import { mockAppointments, mockTreatmentPackages } from "@/lib/mock-data";
import ReviewCard from "@/features/review/components/ServiceReviewCard";
import ReviewModal from "@/features/review/components/ReviewModal";
import TreatmentReviewCard from "@/features/review/components/TreatmentReviewCard"; // Import component mới
import { Appointment } from "@/features/appointment/types";
import { TreatmentPackage } from "@/features/treatment/types";

const ReviewsPage = () => {
  // Dùng state chung cho cả 2 loại
  const [selectedItem, setSelectedItem] = useState<
    Appointment | TreatmentPackage | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lọc các dịch vụ lẻ đã hoàn thành
  const completedAppointments = mockAppointments.filter(
    (appt) => appt.status === "completed"
  );

  // Lọc các liệu trình đã hoàn thành
  const completedTreatments = mockTreatmentPackages.filter(
    (pkg) => pkg.completedSessions === pkg.totalSessions
  );

  const handleWriteReview = (item: Appointment | TreatmentPackage) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Đánh giá dịch vụ & Liệu trình</h1>

      {/* Phần đánh giá dịch vụ lẻ */}
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
                onWriteReview={() => handleWriteReview(appointment)}
              />
            ))
          ) : (
            <p>Bạn không có dịch vụ lẻ nào cần đánh giá.</p>
          )}
        </div>
      </section>

      {/* Phần đánh giá liệu trình */}
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
                onWriteReview={() => handleWriteReview(pkg)}
              />
            ))
          ) : (
            <p>Bạn không có liệu trình nào đã hoàn thành để đánh giá.</p>
          )}
        </div>
      </section>

      {selectedItem && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={closeModal}
          item={selectedItem} // Truyền item vào modal
        />
      )}
    </div>
  );
};

export default ReviewsPage;
