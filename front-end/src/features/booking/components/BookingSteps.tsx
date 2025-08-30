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
                                ${
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : ""
                                }
                                ${
                                  isCompleted
                                    ? "bg-primary text-primary-foreground"
                                    : ""
                                }
                                ${
                                  !isActive && !isCompleted
                                    ? "bg-muted text-muted-foreground"
                                    : ""
                                }
                                `}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              <div
                className={`ml-2 ${
                  isActive || isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-3 ${
                  currentStep > stepNumber ? "bg-primary" : "bg-muted"
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
