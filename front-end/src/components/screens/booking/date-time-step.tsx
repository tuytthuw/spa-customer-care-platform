// src/components/screens/booking/date-time-step.tsx
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Dữ liệu giả cho các khung giờ trống
const availableTimes = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "14:00",
  "14:30",
  "15:00",
  "16:30",
  "17:00",
];

interface DateTimeStepProps {
  onNextStep: () => void;
  // Thêm các props khác để truyền dữ liệu ra ngoài nếu cần
}

export default function DateTimeStep({ onNextStep }: DateTimeStepProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleNext = () => {
    if (date && selectedTime) {
      // Ở đây bạn sẽ cập nhật state chung của trang booking
      console.log("Ngày đã chọn:", date.toLocaleDateString("vi-VN"));
      console.log("Giờ đã chọn:", selectedTime);
      onNextStep(); // Chuyển sang bước tiếp theo
    } else {
      alert("Vui lòng chọn ngày và giờ!");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">1. Chọn ngày và giờ</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(day) =>
              day < new Date(new Date().setDate(new Date().getDate() - 1))
            } // Vô hiệu hóa ngày quá khứ
          />
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="font-medium mb-4">Chọn khung giờ:</h3>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button onClick={handleNext} disabled={!date || !selectedTime}>
          Tiếp theo
        </Button>
      </div>
    </div>
  );
}
