"use client";

import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Appointment } from "@/features/appointment/types";
import { Service } from "@/features/service/types";

// Định nghĩa props
interface InteractiveCalendarProps {
  appointments: Appointment[];
  services: Service[];
  onSelectAppointment: (appointment: Appointment) => void;
}

export default function InteractiveCalendar({
  appointments,
  services,
  onSelectAppointment,
}: InteractiveCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Sử dụng useMemo để tối ưu, chỉ tính lại danh sách ngày có lịch hẹn khi appointments thay đổi
  const appointmentDates = useMemo(
    () => appointments.map((app) => new Date(app.date)),
    [appointments]
  );

  const selectedDayAppointments = appointments
    .filter((app) => new Date(app.date).toDateString() === date?.toDateString())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-primary";
      case "completed":
        return "bg-success";
      case "cancelled":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <div className="md:col-span-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border p-0"
          // Sử dụng modifiers để thêm class tùy chỉnh vào những ngày có lịch hẹn
          modifiers={{ withAppointments: appointmentDates }}
          modifiersClassNames={{
            withAppointments: "has-appointment",
          }}
        />
      </div>
      <div className="md:col-span-1">
        <h4 className="font-semibold mb-3">
          Lịch hẹn ngày {date?.toLocaleDateString("vi-VN")}
        </h4>
        <div className="space-y-3 h-[calc(100vh-14rem)] overflow-y-auto pr-2">
          {selectedDayAppointments.length > 0 ? (
            selectedDayAppointments.map((app) => {
              const service = services.find((s) => s.id === app.serviceId);
              return (
                <button
                  key={app.id}
                  onClick={() => onSelectAppointment(app)}
                  className="w-full text-left"
                >
                  <div className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-1.5 h-2 w-2 rounded-full flex-shrink-0",
                        getStatusColor(app.status)
                      )}
                    ></div>
                    <div>
                      <p className="font-medium text-sm">
                        {new Date(app.date).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {service?.name || "Dịch vụ không xác định"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center pt-8">
              Không có lịch hẹn.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
