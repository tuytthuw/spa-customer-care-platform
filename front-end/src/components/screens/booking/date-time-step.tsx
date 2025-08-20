"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  onNextStep: (date: Date, time: string) => void;
  initialData: {
    date: Date;
    time: string;
  };
}

export default function DateTimeStep({
  onNextStep,
  initialData,
}: DateTimeStepProps) {
  const [date, setDate] = useState<Date | undefined>(initialData.date);
  const [selectedTime, setSelectedTime] = useState<string | null>(
    initialData.time || null
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
      <h2 className="text-xl font-semibold mb-4">1. Chọn ngày và giờ</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center">
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
