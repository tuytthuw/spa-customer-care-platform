// src/app/booking/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import DateTimeStep from "@/components/screens/booking/date-time-step"; // Import component mới

export default function BookingPage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId"); // Lấy serviceId từ URL

  // State để quản lý bước hiện tại của form
  const [step, setStep] = useState(1);

  // State để lưu trữ thông tin người dùng chọn
  const [bookingDetails, setBookingDetails] = useState({
    serviceId: serviceId,
    date: new Date(),
    time: "",
    technicianId: "",
  });

  // Hàm để chuyển sang bước tiếp theo
  const nextStep = () => setStep((prev) => prev + 1);
  // Hàm để quay lại bước trước
  const prevStep = () => setStep((prev) => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        // Chúng ta sẽ tạo component này ở bước tiếp theo
        return <DateTimeStep onNextStep={nextStep} />;
      case 2:
        return <div>Bước 2: Chọn Kỹ thuật viên (Tùy chọn)</div>;
      case 3:
        return <div>Bước 3: Xác nhận thông tin</div>;
      default:
        return <DateTimeStep onNextStep={nextStep} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Đặt Lịch Hẹn</h1>
      <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-lg">
        {/* Hiển thị nội dung của bước hiện tại */}
        {renderStep()}
      </div>
    </div>
  );
}
