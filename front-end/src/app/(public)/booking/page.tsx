// src/app/(public)/booking/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import DateTimeStep from "@/features/booking/components/DateTimeStep";
import ConfirmationStep from "@/features/booking/components/ConfirmationStep";
import ServiceSelectionStep from "@/features/booking/components/ServiceSelectionStep";
import BookingSuccessStep from "@/features/booking/components/BookingSuccessStep";
import { BookingSteps } from "@/features/booking/components/BookingSteps";

import useBookingStore from "@/stores/booking-store";
import { getServiceById } from "@/features/service/api/service.api";
import {
  createAppointment,
  rescheduleAppointment,
} from "@/features/appointment/api/appointment.api";
import { bookTreatmentSession } from "@/features/treatment/api/treatment.api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContexts";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { redeemPurchasedService } from "@/features/customer/api/customer.api";
import { Service } from "@/features/service/types";

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  note: string;
}

export default function BookingPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { data: customers = [] } = useCustomers();
  const { step, service, date, time, rescheduleId, actions } =
    useBookingStore();
  const {
    setService,
    setDateTime,
    nextStep,
    prevStep,
    reset,
    startReschedule,
  } = actions;

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const selectedDate = new Date(dateParam);
      if (!isNaN(selectedDate.getTime())) {
        // Cập nhật ngày trong store nhưng không chuyển bước
        setDateTime(selectedDate, "");
      }
    }
  }, [searchParams, setDateTime]);

  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  const treatmentPackageId = searchParams.get("treatmentPackageId");
  const sessionId = searchParams.get("sessionId");
  const serviceId = searchParams.get("serviceId");
  const rescheduleIdParam = searchParams.get("rescheduleId");
  const isTreatmentBooking = !!treatmentPackageId;

  useQuery({
    queryKey: ["booking_service", serviceId],
    queryFn: async () => {
      if (rescheduleIdParam && serviceId) {
        const fetchedService = await getServiceById(serviceId);
        if (fetchedService) {
          startReschedule(fetchedService, rescheduleIdParam);
        }
        return fetchedService;
      }
      if (serviceId && !service) {
        const fetchedService = await getServiceById(serviceId);
        if (fetchedService) {
          setService(fetchedService);
        }
        return fetchedService;
      }
      return service;
    },
    enabled: !!serviceId,
  });

  useEffect(() => {
    // Reset store when the component unmounts
    return () => {
      reset();
    };
  }, [reset]);

  const [isPrePurchased, setIsPrePurchased] = useState(false);

  useEffect(() => {
    if (service && currentUserProfile?.purchasedServices) {
      const purchased = currentUserProfile.purchasedServices.find(
        (s) => s.serviceId === service.id && s.quantity > 0
      );
      setIsPrePurchased(!!purchased);
    } else {
      setIsPrePurchased(false);
    }
  }, [service, currentUserProfile]);

  const redeemServiceMutation = useMutation({
    mutationFn: (data: { customerId: string; serviceId: string }) =>
      redeemPurchasedService(data.customerId, data.serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    // Không cần xử lý onError ở đây vì createAppointment sẽ báo lỗi chung
  });

  const handleServiceSelect = (selectedService: Service) => {
    setService(selectedService);
    nextStep(); // Chuyển từ Bước 1 -> Bước 2
  };

  const handleDateTimeSelect = (selectedDate: Date, selectedTime: string) => {
    setDateTime(selectedDate, selectedTime);
    nextStep(); // Chuyển từ Bước 2 -> Bước 3
  };

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Đặt lịch thành công!");
      nextStep();
    },
    onError: (error) => toast.error(`Đặt lịch thất bại: ${error.message}`),
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, date }: { id: string; date: string }) =>
      rescheduleAppointment(id, date),
    onSuccess: () => {
      toast.success("Thay đổi lịch hẹn thành công!");
      nextStep();
    },
    onError: (error) => toast.error(`Thay đổi lịch thất bại: ${error.message}`),
  });

  const bookTreatmentSessionMutation = useMutation({
    mutationFn: bookTreatmentSession,
    onSuccess: () => {
      toast.success("Đặt lịch cho buổi trị liệu thành công!");
      queryClient.invalidateQueries({ queryKey: ["customerTreatments"] });
      nextStep();
    },
    onError: (error) => toast.error(`Đặt lịch thất bại: ${error.message}`),
  });

  const handleConfirmBooking = (customerInfo: CustomerInfo) => {
    const [hours, minutes] = time.split(":").map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    if (rescheduleId) {
      rescheduleMutation.mutate({
        id: rescheduleId,
        date: appointmentDate.toISOString(),
      });
      return;
    }

    if (isPrePurchased && service && currentUserProfile) {
      redeemServiceMutation.mutate({
        customerId: currentUserProfile.id,
        serviceId: service.id,
      });
      createAppointmentMutation.mutate({
        customerId: currentUserProfile.id,
        serviceId: service.id,
        date: appointmentDate.toISOString(),
        customerNote: customerInfo.note,
        paymentStatus: "paid",
      });
      return;
    }

    if (treatmentPackageId && sessionId && service && currentUserProfile) {
      bookTreatmentSessionMutation.mutate({
        treatmentPackageId,
        sessionId,
        date: appointmentDate.toISOString(),
        customerId: currentUserProfile.id,
        serviceId: service.id,
      });
    } else if (service) {
      if (user && currentUserProfile) {
        createAppointmentMutation.mutate({
          customerId: currentUserProfile.id,
          serviceId: service.id,
          date: appointmentDate.toISOString(),
          customerNote: customerInfo.note,
          paymentStatus: "unpaid",
        });
      } else {
        createAppointmentMutation.mutate({
          customerId: "guest-user",
          serviceId: service.id,
          date: appointmentDate.toISOString(),
          guestName: customerInfo.name,
          guestPhone: customerInfo.phone,
          guestEmail: customerInfo.email,
          customerNote: customerInfo.note,
          paymentStatus: "unpaid",
        });
      }
    }
  };

  const handlePrevStep = () => {
    if (isTreatmentBooking) {
      router.back(); // Quay lại trang trước đó (trang chi tiết liệu trình)
    } else {
      prevStep(); // Quay lại bước chọn dịch vụ như cũ
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        // Truyền hàm xử lý mới vào component
        return <ServiceSelectionStep onServiceSelect={handleServiceSelect} />;
      case 2:
        return (
          <DateTimeStep
            // Truyền hàm xử lý mới vào component
            onNextStep={handleDateTimeSelect}
            onPrevStep={prevStep} // Dùng trực tiếp prevStep từ store
            bookingDetails={{ service, date, time }}
            isTreatmentBooking={isTreatmentBooking}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            bookingDetails={{ service, date, time }}
            onPrevStep={prevStep} // Dùng trực tiếp prevStep từ store
            onConfirm={handleConfirmBooking}
            isSubmitting={
              createAppointmentMutation.isPending ||
              bookTreatmentSessionMutation.isPending ||
              redeemServiceMutation.isPending ||
              rescheduleMutation.isPending
            }
            isPrePurchased={isPrePurchased}
          />
        );
      case 4:
        return (
          <BookingSuccessStep
            bookingDetails={{ service, date, time }}
            isReschedule={false}
            redirectUrl={user ? "/customer-schedules" : "/"}
            redirectText={
              user ? "Quay về Lịch trình của tôi" : "Quay về Trang chủ"
            }
          />
        );
      default:
        return <ServiceSelectionStep onServiceSelect={handleServiceSelect} />;
    }
  };

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      {step < 4 && <BookingSteps currentStep={step} />}
      {renderStep()}
    </main>
  );
}
