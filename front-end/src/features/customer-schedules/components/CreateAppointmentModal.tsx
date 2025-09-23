// src/features/customer-schedules/components/CreateAppointmentModal.tsx
"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useBookingStore from "@/stores/booking-store";
import { BookingSteps } from "@/features/booking/components/BookingSteps";
import ServiceSelectionStep from "@/features/booking/components/ServiceSelectionStep";
import DateTimeStep from "@/features/booking/components/DateTimeStep";
import ConfirmationStep from "@/features/booking/components/ConfirmationStep";
import BookingSuccessStep from "@/features/booking/components/BookingSuccessStep";
import { CustomerInfo } from "@/features/booking/types";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    customerInfo: CustomerInfo,
    serviceId: string,
    date: Date,
    time: string
  ) => void;
  isSubmitting: boolean;
  initialDate?: Date;
}

export default function CreateAppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  initialDate,
}: CreateAppointmentModalProps) {
  const { step, service, date, time, actions } = useBookingStore();
  const { setService, setDateTime, nextStep, prevStep, reset } = actions;

  useEffect(() => {
    reset();
    if (initialDate) {
      setDateTime(initialDate, "");
    }
  }, [isOpen, reset, initialDate, setDateTime]);

  const handleConfirm = (customerInfo: CustomerInfo) => {
    if (service) {
      onConfirm(customerInfo, service.id, date, time);
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
            bookingDetails={{ service, date: initialDate || date, time }}
            isTreatmentBooking={false}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            bookingDetails={{ service, date, time }}
            onPrevStep={prevStep}
            onConfirm={handleConfirm}
            isSubmitting={isSubmitting}
            isPrePurchased={false}
          />
        );
      case 4:
        return (
          <BookingSuccessStep
            bookingDetails={{ service, date, time }}
            isReschedule={false}
          />
        );
      default:
        return <ServiceSelectionStep onServiceSelect={setService} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn mới</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-1 -m-1">
          {step < 4 && <BookingSteps currentStep={step} />}
          <div className="mt-6">{renderStep()}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
