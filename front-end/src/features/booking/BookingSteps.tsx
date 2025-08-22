"use client";

import React from "react";

interface BookingStepsProps {
  currentStep: number;
}

export const BookingSteps = ({ currentStep }: BookingStepsProps) => {
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
