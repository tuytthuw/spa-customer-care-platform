"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { mockAppointments, mockServices } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateAppointmentForm from "@/components/forms/CreateAppointmentForm";
import { Appointment } from "@/types/appointment";

export default function AppointmentsManagementPage() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Định dạng lại dữ liệu cho FullCalendar
  const calendarEvents = appointments.map((appt) => {
    const service = mockServices.find((s) => s.id === appt.serviceId);
    return {
      id: appt.id,
      title: service?.name || "Dịch vụ không xác định",
      start: appt.date,
      extendedProps: { ...appt },
      backgroundColor:
        appt.status === "completed"
          ? "#22c55e"
          : appt.status === "cancelled"
          ? "#ef4444"
          : "#3b82f6",
      borderColor:
        appt.status === "completed"
          ? "#16a34a"
          : appt.status === "cancelled"
          ? "#dc2626"
          : "#2563eb",
    };
  });

  const handleDateClick = (clickInfo: DateClickArg) => {
    setSelectedDate(clickInfo.date);
    setIsModalOpen(true);
  };

  const handleCreateAppointment = (data: Omit<Appointment, "id">) => {
    // Đây là nơi bạn sẽ gọi API để tạo lịch hẹn mới
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      ...data,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    console.log("Đã tạo lịch hẹn mới:", newAppointment);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Lịch hẹn</h1>
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
          selectable={true}
          dateClick={handleDateClick}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo lịch hẹn mới</DialogTitle>
            {selectedDate && (
              <DialogDescription>
                Tạo lịch hẹn cho khách vào lúc{" "}
                {selectedDate.toLocaleString("vi-VN", { timeStyle: "short" })}
                {" ngày "}
                {selectedDate.toLocaleDateString("vi-VN", {
                  dateStyle: "long",
                })}
                .
              </DialogDescription>
            )}
          </DialogHeader>
          {selectedDate && (
            <CreateAppointmentForm
              selectedDate={selectedDate}
              onFormSubmit={handleCreateAppointment}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
