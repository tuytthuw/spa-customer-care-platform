"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { mockAppointments, mockServices, mockUser } from "@/lib/mock-data";
import { AppointmentDetailsModal } from "@/features/schedule/AppointmentDetailsModal";

// Định nghĩa kiểu dữ liệu cho sự kiện trên lịch
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  extendedProps: {
    [key: string]: any;
  };
}

export default function SchedulePage() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [notes, setNotes] = useState("");

  // Chuyển đổi dữ liệu lịch hẹn sang định dạng mà FullCalendar có thể đọc
  const calendarEvents = appointments
    .filter((appt) => appt.status === "upcoming")
    .map((appt) => {
      const service = mockServices.find((s) => s.id === appt.serviceId);
      return {
        id: appt.id,
        title: service?.name || "Dịch vụ không xác định",
        start: appt.date,
        extendedProps: {
          ...appt,
          serviceName: service?.name,
          customerName: mockUser.name,
          customerId: mockUser.id,
        },
      };
    });

  // Xử lý khi người dùng nhấp vào một sự kiện trên lịch
  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event as CalendarEvent);
    setNotes(""); // Reset ghi chú mỗi khi mở dialog
    setIsModalOpen(true);
  };

  // Xử lý khi hoàn thành một dịch vụ
  const handleCompleteService = () => {
    if (!selectedEvent) return;

    console.log(`Hoàn thành lịch hẹn ID: ${selectedEvent.id}`);
    console.log(`Ghi chú: ${notes}`);

    // Cập nhật trạng thái của lịch hẹn trong state
    setAppointments((currentAppointments) =>
      currentAppointments.map((appt) =>
        appt.id === selectedEvent.id ? { ...appt, status: "completed" } : appt
      )
    );

    // Đóng modal
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lịch làm việc của tôi</h1>
      <div className="p-4 bg-card rounded-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          locale="vi"
          buttonText={{
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
          }}
          allDayText="Cả ngày"
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
        />
      </div>

      {/* Render component Modal đã được tách ra */}
      <AppointmentDetailsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedEvent={selectedEvent}
        notes={notes}
        setNotes={setNotes}
        onComplete={handleCompleteService}
      />
    </div>
  );
}
