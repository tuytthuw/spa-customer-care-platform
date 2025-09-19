// src/features/schedule/components/ScheduleCalendarView.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Appointment } from "@/features/appointment/types";

// Import các component con sẽ được tạo tiếp theo
import ActionRequiredList from "./ActionRequiredList";
import InteractiveCalendar from "./InteractiveCalendar";
import AppointmentDetailPanel from "./AppointmentDetailPanel";
import { ScheduleDataProps } from "@/features/customer-schedules/types";

// Component này sẽ nhận tất cả props dữ liệu từ trang cha
export default function ScheduleCalendarView(props: ScheduleDataProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  return (
    <div className="grid lg:grid-cols-[320px_1fr_auto] gap-6 h-full flex-grow">
      {/* --- Cột 1: Cần đặt lịch --- */}
      <div className="hidden lg:block bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Cần đặt lịch</h3>
        <ActionRequiredList {...props} />
      </div>

      {/* --- Cột 2: Lịch trình --- */}
      <div className="h-full">
        <InteractiveCalendar
          {...props}
          onSelectAppointment={setSelectedAppointment}
        />
      </div>

      {/* --- Cột 3: Chi tiết (Hiện/ẩn) --- */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          selectedAppointment ? "w-[400px]" : "w-0"
        )}
      >
        {selectedAppointment && (
          <AppointmentDetailPanel
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            {...props}
          />
        )}
      </div>
    </div>
  );
}
