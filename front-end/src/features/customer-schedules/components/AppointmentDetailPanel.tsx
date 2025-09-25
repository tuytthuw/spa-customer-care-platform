// src/features/customer-schedules/components/AppointmentDetailPanel.tsx
"use client";

import { Button } from "@/features/shared/components/ui/button";
import { Appointment } from "@/features/appointment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import { Separator } from "@/features/shared/components/ui/separator";
import { X } from "lucide-react";
import { Badge } from "@/features/shared/components/ui/badge";
import { Review } from "@/features/review/types"; // <-- IMPORT THÊM

// THAY ĐỔI 1: Thêm 'reviews', 'onCancelAppointment', và 'onWriteReview' vào props interface
interface AppointmentDetailPanelProps {
  appointment: Appointment;
  services: Service[];
  staff: Staff[];
  reviews: Review[]; // <-- THÊM DÒNG NÀY
  onClose: () => void;
  onCancelAppointment: (id: string, reason: string) => void;
  onWriteReview: (appointment: Appointment) => void;
}

export default function AppointmentDetailPanel({
  appointment,
  services,
  staff,
  reviews, // <-- Nhận prop mới
  onClose,
  onCancelAppointment, // <-- Nhận hàm mới
  onWriteReview, // <-- Nhận hàm mới
}: AppointmentDetailPanelProps) {
  const service = services.find((s) => s.id === appointment.serviceId);
  const technician = staff.find((t) => t.id === appointment.technicianId);

  if (!service) return null;

  // THAY ĐỔI 2: Thêm logic kiểm tra đã review hay chưa
  const hasReviewed = reviews.some((r) => r.appointmentId === appointment.id);

  return (
    <div className="bg-card border rounded-lg h-full flex flex-col p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Chi tiết Lịch hẹn</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <div className="space-y-4 my-4 flex-grow">
        <p className="font-bold text-primary">{service.name}</p>
        <div>
          <p className="text-sm text-muted-foreground">Thời gian</p>
          <p className="font-medium">
            {new Date(appointment.start).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            - {new Date(appointment.start).toLocaleDateString("vi-VN")}
          </p>
        </div>
        {technician && (
          <div>
            <p className="text-sm text-muted-foreground">Kỹ thuật viên</p>
            <p className="font-medium">{technician.name}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">Thanh toán</p>
          <Badge
            variant={
              appointment.paymentStatus === "paid" ? "default" : "destructive"
            }
          >
            {appointment.paymentStatus === "paid"
              ? "Đã thanh toán"
              : "Chưa thanh toán"}
          </Badge>
        </div>
      </div>

      {/* THAY ĐỔI 3: Cập nhật lại logic cho các nút bấm */}
      <div className="space-y-2 mt-auto">
        {appointment.status === "upcoming" && (
          <Button
            variant="destructive"
            className="w-full"
            // Gọi hàm onCancelAppointment đã được truyền từ props
            onClick={() =>
              onCancelAppointment(
                appointment.id,
                "Customer cancelled from calendar view"
              )
            }
          >
            Hủy lịch
          </Button>
        )}
        {appointment.status === "completed" && !hasReviewed && (
          <Button
            className="w-full"
            // Gọi hàm onWriteReview đã được truyền từ props
            onClick={() => onWriteReview(appointment)}
          >
            Viết đánh giá
          </Button>
        )}
        {appointment.status === "completed" && hasReviewed && (
          <Button className="w-full" disabled>
            Đã đánh giá
          </Button>
        )}
      </div>
    </div>
  );
}
