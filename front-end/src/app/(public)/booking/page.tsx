"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import DateTimeStep from "@/features/booking/components/date-time-step";
import ConfirmationStep from "@/features/booking/components/confirmation-step";
import ServiceSelectionStep from "@/features/booking/components/ServiceSelectionStep";
import BookingSuccessStep from "@/features/booking/components/BookingSuccessStep";
import { Service } from "@/types/service";
import { BookingSteps } from "@/features/booking/components/BookingSteps";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  const [step, setStep] = useState(serviceId ? 2 : 1);
  const [bookingDetails, setBookingDetails] = useState({
    service: null as Service | null,
    date: new Date(),
    time: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleServiceSelect = (service: Service) => {
    setBookingDetails((prev) => ({ ...prev, service }));
    nextStep();
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setBookingDetails((prev) => ({ ...prev, date, time }));
    nextStep();
  };

  const handleConfirmBooking = () => {
    console.log("Dữ liệu đặt lịch cuối cùng:", bookingDetails);
    setStep(4);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ServiceSelectionStep onServiceSelect={handleServiceSelect} />;
      case 2:
        return (
          <DateTimeStep
            onNextStep={handleDateTimeSelect}
            onPrevStep={() => setStep(1)}
            bookingDetails={bookingDetails}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            bookingDetails={bookingDetails}
            onPrevStep={prevStep}
            onConfirm={handleConfirmBooking}
          />
        );
      case 4:
        return <BookingSuccessStep bookingDetails={bookingDetails} />;
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
