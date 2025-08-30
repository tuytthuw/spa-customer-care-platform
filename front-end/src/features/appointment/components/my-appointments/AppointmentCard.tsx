"use client";

import { useState } from "react";
import { Appointment } from "@/features/appointment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CancelAppointmentModal from "./CancelAppointmentModal";

// 1. Cập nhật Props để nhận đầy đủ object `service` và `technician`
interface AppointmentCardProps {
  appointment: Appointment;
  service: Service;
  technician?: Staff; // Kỹ thuật viên có thể không được chỉ định
  onCancel: (id: string, reason: string) => void;
}

const AppointmentCard = ({
  appointment,
  service, // 2. Nhận service từ props
  technician, // 3. Nhận technician từ props
  onCancel,
}: AppointmentCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 4. Bỏ các dòng .find() không cần thiết vì dữ liệu đã được truyền vào
  // const service = mockServices.find((s) => s.id === appointment.serviceId);
  // const technician = mockStaff.find((t) => t.id === appointment.technicianId);

  // Không cần kiểm tra service nữa vì nó là prop bắt buộc
  // if (!service) {
  //   return null;
  // }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default";
      case "completed":
        return "secondary";
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
            <p>{technician ? technician.name : "Hệ thống tự sắp xếp"}</p>
            <p className="font-semibold mt-2">Thời gian:</p>
            {/* Lấy giờ trực tiếp từ dữ liệu lịch hẹn */}
            <p>
              {new Date(appointment.date).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
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
