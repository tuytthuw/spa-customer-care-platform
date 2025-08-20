"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import DateTimeStep from "@/components/screens/booking/date-time-step";
import TechnicianStep from "@/components/screens/booking/technician-step";
import ConfirmationStep from "@/components/screens/booking/confirmation-step";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  const [step, setStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    serviceId: serviceId,
    date: new Date(),
    time: "",
    technicianId: undefined as string | undefined,
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleDateTimeSelect = (date: Date, time: string) => {
    setBookingDetails((prev) => ({ ...prev, date, time }));
    nextStep();
  };

  const handleTechnicianSelect = (technicianId?: string) => {
    setBookingDetails((prev) => ({ ...prev, technicianId }));
    nextStep();
  };

  const handleConfirmBooking = () => {
    // Đây là nơi bạn sẽ gọi API để gửi dữ liệu lên server
    console.log("Dữ liệu đặt lịch cuối cùng:", bookingDetails);
    alert("Đặt lịch thành công! Cảm ơn bạn.");
    // Chuyển hướng người dùng đến trang "Lịch hẹn của tôi"
    // router.push('/appointments');
    setStep(4); // Chuyển sang bước thành công
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <DateTimeStep
            onNextStep={handleDateTimeSelect}
            initialData={bookingDetails}
          />
        );
      case 2:
        return (
          <TechnicianStep
            onNextStep={handleTechnicianSelect}
            onPrevStep={prevStep}
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
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Đặt lịch thành công!
            </h2>
            <p>Cảm ơn bạn đã tin tưởng dịch vụ của MySpa.</p>
            <p>Chúng tôi đã gửi thông tin xác nhận đến email của bạn.</p>
          </div>
        );
      default:
        return (
          <DateTimeStep
            onNextStep={handleDateTimeSelect}
            initialData={bookingDetails}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Đặt Lịch Hẹn</h1>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-8">{renderStep()}</CardContent>
      </Card>
    </div>
  );
}
