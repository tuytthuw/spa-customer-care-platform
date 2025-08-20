"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { mockAppointments } from "@/lib/mock-data";
import { mockServices } from "@/lib/mock-data";
import { mockUser } from "@/lib/mock-data"; // Giả sử đây là khách hàng
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// --- Bổ sung kiểu dữ liệu cho Event ---
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

  // --- Cập nhật logic để lọc và map appointments ---
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
          customerId: mockUser.id, // Thêm customerId để link
        },
      };
    });

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event as CalendarEvent);
    setNotes(""); // Reset ghi chú mỗi khi mở dialog
    setIsModalOpen(true);
  };

  const handleCompleteService = () => {
    if (!selectedEvent) return;

    // 1. Gọi API để cập nhật trạng thái và lưu ghi chú
    console.log(`Hoàn thành lịch hẹn ID: ${selectedEvent.id}`);
    console.log(`Ghi chú: ${notes}`);

    // 2. Cập nhật state ở frontend để giao diện thay đổi
    setAppointments((currentAppointments) =>
      currentAppointments.map((appt) =>
        appt.id === selectedEvent.id ? { ...appt, status: "completed" } : appt
      )
    );

    // 3. Đóng modal
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.extendedProps.serviceName}
            </DialogTitle>
            <DialogDescription>Chi tiết lịch hẹn</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Khách hàng</Label>
                <p className="font-medium">
                  {selectedEvent.extendedProps.customerName}
                </p>
              </div>
              <div>
                <Label>Thời gian</Label>
                <p className="font-medium">
                  {new Date(selectedEvent.start).toLocaleString("vi-VN", {
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div>
                <Label htmlFor="notes">Ghi chú sau dịch vụ</Label>
                <Textarea
                  id="notes"
                  placeholder="Nhập ghi chú về tình trạng da, sản phẩm đã dùng..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-6 sm:justify-between">
            {/* Nút xem hồ sơ sẽ điều hướng đến trang chi tiết khách hàng */}
            <Button variant="outline" asChild>
              <Link
                href={`/customers/${selectedEvent?.extendedProps.customerId}`}
              >
                Xem hồ sơ khách hàng
              </Link>
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="ghost">Đóng</Button>
              </DialogClose>
              <Button onClick={handleCompleteService}>
                Hoàn thành dịch vụ
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
