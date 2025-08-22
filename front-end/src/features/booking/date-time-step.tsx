"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const availableTimes = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:30",
];
const bookedTimes = ["12:00", "12:30", "15:00"];

export default function DateTimeStep({
  onNextStep,
  onPrevStep,
  bookingDetails,
}: any) {
  const [date, setDate] = useState<Date | undefined>(bookingDetails.date);
  const [selectedTime, setSelectedTime] = useState<string | null>(
    bookingDetails.time || null
  );

  const handleNext = () => {
    if (date && selectedTime) {
      onNextStep(date, selectedTime);
    } else {
      alert("Vui lòng chọn ngày và giờ!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={onPrevStep}
          className="text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại chọn dịch vụ
        </Button>
        {bookingDetails.service && (
          <div className="p-3 bg-card rounded-lg border border-border shadow-sm text-right">
            <h3 className="text-lg">{bookingDetails.service.name}</h3>
            <p className="text-muted-foreground">
              {bookingDetails.service.duration} phút -{" "}
              {new Intl.NumberFormat("vi-VN").format(
                bookingDetails.service.price
              )}{" "}
              VNĐ
            </p>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <h2 className="text-2xl mb-6 text-foreground">Chọn ngày và giờ</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Calendar */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg mb-3">Chọn ngày</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(day) =>
                day < new Date(new Date().setDate(new Date().getDate() - 1))
              }
            />
          </div>

          {/* Time Slots */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg mb-3">
              Chọn giờ - {date?.toLocaleDateString("vi-VN")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className={`${
                    selectedTime === time ? "bg-primary border-primary" : ""
                  }`}
                >
                  {time}
                </Button>
              ))}
              {bookedTimes.map((time) => (
                <Button
                  key={time}
                  disabled
                  className="cursor-not-allowed bg-muted text-muted-foreground"
                >
                  {time} (Đã đặt)
                </Button>
              ))}
            </div>
            <div className="mt-6">
              <Button
                onClick={handleNext}
                disabled={!date || !selectedTime}
                className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
