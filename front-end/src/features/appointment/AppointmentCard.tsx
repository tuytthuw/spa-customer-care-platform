"use client";

import { useState } from "react";
import { Appointment } from "@/types/appointment";
import { mockServices, mockStaff } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CancelAppointmentModal from "./CancelAppointmentModal";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string, reason: string) => void;
}

const AppointmentCard = ({ appointment, onCancel }: AppointmentCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const service = mockServices.find((s) => s.id === appointment.serviceId);
  const technician = mockStaff.find((t) => t.id === appointment.technicianId);

  if (!service) {
    return null;
  }

  // === SỬA LỖI Ở ĐÂY: SỬ DỤNG VARIANT CÓ SẴN ===
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default";
      case "completed":
        return "secondary"; // Sử dụng "secondary" thay vì "success"
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleConfirmCancel = (reason: string) => {
    onCancel(appointment.id, reason);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>
                {new Date(appointment.date).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            {/* Bỏ class màu tùy chỉnh */}
            <Badge variant={getStatusVariant(appointment.status)}>
              {appointment.status === "upcoming" && "Sắp tới"}
              {appointment.status === "completed" && "Đã hoàn thành"}
              {appointment.status === "cancelled" && "Đã hủy"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <Image
              src={service.imageUrl}
              alt={service.name}
              width={200}
              height={200}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="font-semibold">Kỹ thuật viên:</p>
            <p>{technician ? technician.name : "Chưa xác định"}</p>
            <p className="font-semibold mt-2">Thời gian:</p>
            <p>10:00 - 11:00 (Ví dụ)</p>
          </div>
        </CardContent>
        {appointment.status === "upcoming" && (
          <CardFooter className="flex justify-end">
            <Button variant="destructive" onClick={() => setIsModalOpen(true)}>
              Hủy lịch
            </Button>
          </CardFooter>
        )}
      </Card>

      <CancelAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
};

export default AppointmentCard;
