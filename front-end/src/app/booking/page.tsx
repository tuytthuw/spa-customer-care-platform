"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import DateTimeStep from "@/components/screens/booking/date-time-step";
import ConfirmationStep from "@/components/screens/booking/confirmation-step";
import ServiceSelectionStep from "@/components/screens/booking/ServiceSelectionStep";
import BookingSuccessStep from "@/components/screens/booking/BookingSuccessStep";
import { Service } from "@/types/service";

// Component hiển thị các bước (Stepper)
const BookingSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Chọn dịch vụ", "Chọn ngày/giờ", "Xác nhận"];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <React.Fragment key={stepNumber}>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center
                                ${isActive ? "bg-neutral-800 text-white" : ""}
                                ${
                                  isCompleted ? "bg-neutral-800 text-white" : ""
                                }
                                ${
                                  !isActive && !isCompleted
                                    ? "bg-neutral-300 text-neutral-600"
                                    : ""
                                }
                                `}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              <div
                className={`ml-2 ${
                  isActive || isCompleted
                    ? "text-neutral-800"
                    : "text-neutral-500"
                }`}
              >
                {label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-3 ${
                  currentStep > stepNumber ? "bg-neutral-800" : "bg-neutral-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

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
