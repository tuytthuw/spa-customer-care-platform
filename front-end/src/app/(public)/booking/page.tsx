// src/app/(public)/booking/page.tsx

"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import DateTimeStep from "@/features/booking/components/date-time-step";
import ConfirmationStep from "@/features/booking/components/ConfirmationStep";
import ServiceSelectionStep from "@/features/booking/components/ServiceSelectionStep";
import BookingSuccessStep from "@/features/booking/components/BookingSuccessStep";
import { BookingSteps } from "@/features/booking/components/BookingSteps";

import useBookingStore from "@/stores/booking-store";
import { getServiceById } from "@/features/service/api/service.api";
import { createAppointment } from "@/features/appointment/api/appointment.api";
import { bookTreatmentSession } from "@/features/treatment/api/treatment.api";
import { toast } from "sonner";
import { Service } from "@/features/service/types";

export default function BookingPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { step, service, date, time, actions } = useBookingStore();
  const { setService, setDateTime, nextStep, prevStep, reset } = actions;

  // ✅ Lấy các tham số từ URL
  const treatmentPackageId = searchParams.get("treatmentPackageId");
  const sessionId = searchParams.get("sessionId");
  const serviceId = searchParams.get("serviceId");

  // Nếu có serviceId từ URL (dù là đặt mới hay từ liệu trình),
  // fetch thông tin dịch vụ và tự động chuyển bước.
  useQuery({
    queryKey: ["booking_service", serviceId],
    queryFn: async () => {
      const fetchedService = await getServiceById(serviceId!);
      if (fetchedService) {
        setService(fetchedService);
      }
      return fetchedService;
    },
    enabled: !!serviceId && !service, // Chỉ chạy khi có serviceId và service trong store chưa được set
  });

  useEffect(() => {
    return () => {
      reset(); // Reset khi rời khỏi trang
    };
  }, [reset]);

  // Logic tạo lịch hẹn mới (cho dịch vụ lẻ)
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Đặt lịch thành công!");
      nextStep();
    },
    onError: (error) => toast.error(`Đặt lịch thất bại: ${error.message}`),
  });

  // ✅ Logic đặt lịch cho liệu trình đã mua
  const bookTreatmentSessionMutation = useMutation({
    mutationFn: bookTreatmentSession,
    onSuccess: () => {
      toast.success("Đặt lịch cho buổi trị liệu thành công!");
      queryClient.invalidateQueries({ queryKey: ["customerTreatments"] }); // Cập nhật lại dữ liệu liệu trình
      nextStep();
    },
    onError: (error) => toast.error(`Đặt lịch thất bại: ${error.message}`),
  });

  const handleConfirmBooking = () => {
    // Kết hợp ngày và giờ
    const [hours, minutes] = time.split(":").map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // ✅ KIỂM TRA: Đây là đặt lịch cho liệu trình hay đặt mới?
    if (treatmentPackageId && sessionId && service) {
      // Đặt cho liệu trình
      bookTreatmentSessionMutation.mutate({
        treatmentPackageId,
        sessionId,
        date: appointmentDate.toISOString(),
        // technicianId sẽ được thêm ở bước sau nếu có
      });
    } else if (service) {
      // Đặt dịch vụ lẻ mới
      createAppointmentMutation.mutate({
        customerId: "guest-user", // Sẽ lấy từ user đang đăng nhập
        serviceId: service.id,
        date: appointmentDate.toISOString(),
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ServiceSelectionStep onServiceSelect={setService} />;
      case 2:
        return (
          <DateTimeStep
            onNextStep={setDateTime}
            onPrevStep={prevStep}
            bookingDetails={{ service, date, time }}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            bookingDetails={{ service, date, time }}
            onPrevStep={prevStep}
            onConfirm={handleConfirmBooking}
            isSubmitting={
              createAppointmentMutation.isPending ||
              bookTreatmentSessionMutation.isPending
            }
          />
        );
      case 4:
        return <BookingSuccessStep bookingDetails={{ service, date, time }} />;
      default:
        return <ServiceSelectionStep onServiceSelect={setService} />;
    }
  };

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      {step < 4 && <BookingSteps currentStep={step} />}
      {renderStep()}
    </main>
  );
}
