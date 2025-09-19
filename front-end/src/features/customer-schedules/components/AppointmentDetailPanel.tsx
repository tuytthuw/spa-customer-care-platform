// src/features/schedule/components/AppointmentDetailPanel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Appointment } from "@/features/appointment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppointmentDetailPanelProps {
  appointment: Appointment;
  services: Service[];
  staff: Staff[];
  onClose: () => void;
}

export default function AppointmentDetailPanel({
  appointment,
  services,
  staff,
  onClose,
}: AppointmentDetailPanelProps) {
  const service = services.find((s) => s.id === appointment.serviceId);
  const technician = staff.find((t) => t.id === appointment.technicianId);

  if (!service) return null;

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
            {new Date(appointment.date).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            - {new Date(appointment.date).toLocaleDateString("vi-VN")}
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

      <div className="space-y-2 mt-auto">
        {appointment.status === "upcoming" && (
          <Button variant="destructive" className="w-full">
            Hủy lịch
          </Button>
        )}
        {appointment.status === "completed" && (
          <Button className="w-full">Viết đánh giá</Button>
        )}
      </div>
    </div>
  );
}
