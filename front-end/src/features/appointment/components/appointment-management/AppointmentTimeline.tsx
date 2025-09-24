// src/features/appointment/components/appointment-management/AppointmentTimeline.tsx
"use client";

import React from "react";
import { Appointment } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types"; // 1. Import Staff type
import { FullCalendarUI } from "@/features/shared/components/ui/full-calendar"; // 2. Import FullCalendarUI
import { EventClickArg, EventDropArg } from "@fullcalendar/core";

interface AppointmentTimelineProps {
  appointments: Appointment[];
  customers: Customer[];
  services: Service[];
  staff: Staff[]; // Thêm staff vào props
  onSelectAppointment: (appointment: Appointment) => void;
  onEventDrop?: (info: EventDropArg) => void;
}

export const AppointmentTimeline = ({
  appointments,
  customers,
  services,
  staff,
  onSelectAppointment,
  onEventDrop,
}: AppointmentTimelineProps) => {
  // 3. Chuyển đổi dữ liệu cho FullCalendar
  // Tạo "resource" (nguồn lực) là các kỹ thuật viên
  const calendarResources = staff
    .filter((s) => s.role === "technician")
    .map((technician) => ({
      id: technician.id,
      title: technician.name,
    }));

  // Tạo "event" (sự kiện) là các lịch hẹn
  const calendarEvents = appointments.map((app) => {
    const customer = customers.find((c) => c.id === app.customerId);
    const service = services.find((s) => s.id === app.serviceId);

    // Tính thời gian kết thúc dựa trên duration của dịch vụ
    const startTime = new Date(app.date);
    const endTime = service
      ? new Date(startTime.getTime() + service.duration * 60000)
      : new Date(startTime.getTime() + 60 * 60000); // Mặc định 60 phút nếu không có dịch vụ

    return {
      id: app.id,
      resourceId: app.technicianId, // Gán lịch hẹn cho kỹ thuật viên tương ứng
      title: customer ? customer.name : "Khách lẻ",
      start: startTime,
      end: endTime,
      // Thêm màu sắc dựa trên trạng thái (tùy chọn)
      color:
        app.status === "completed"
          ? "var(--status-success)"
          : app.status === "in-progress"
          ? "var(--status-processing)"
          : "var(--primary)",
    };
  });

  // 4. Hàm xử lý khi người dùng nhấp vào một lịch hẹn trên lịch
  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointmentId = clickInfo.event.id;
    const selected = appointments.find((app) => app.id === appointmentId);
    if (selected) {
      onSelectAppointment(selected);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto h-full">
      {/* 5. Render FullCalendarUI với dữ liệu đã được xử lý */}
      <FullCalendarUI
        // Các props cơ bản
        initialView="resourceTimelineDay"
        resources={calendarResources}
        events={calendarEvents}
        // Các props cho tương tác
        editable={true} // Cho phép kéo thả
        eventDrop={onEventDrop} // Hàm xử lý khi thả sự kiện
        eventClick={handleEventClick} // Hàm xử lý khi nhấp vào sự kiện
        // Tùy chỉnh giao diện
        slotMinTime="08:00:00" // Giờ bắt đầu
        slotMaxTime="21:00:00" // Giờ kết thúc
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "resourceTimelineDay,resourceTimelineWeek",
        }}
        locale="vi" // Ngôn ngữ Tiếng Việt
        resourceAreaHeaderContent="Kỹ thuật viên"
      />
    </div>
  );
};
