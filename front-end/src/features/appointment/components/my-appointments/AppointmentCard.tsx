"use client";

import { useState } from "react";
import { Appointment, PaymentStatus } from "@/features/appointment/types";
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
import { TreatmentPackage, TreatmentPlan } from "@/features/treatment/types";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface AppointmentCardProps {
  appointment: Appointment;
  service: Service;
  technician?: Staff;
  treatmentPackage?: TreatmentPackage;
  treatmentPlan?: TreatmentPlan;
  onCancel: (id: string, reason: string) => void;
  onReview: (appointment: Appointment) => void;
  hasReviewed: boolean;
}

const AppointmentCard = ({
  appointment,
  service,
  technician,
  treatmentPackage,
  treatmentPlan,
  onCancel,
  onReview,
  hasReviewed,
}: AppointmentCardProps) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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

  const getPaymentStatusInfo = (status?: PaymentStatus) => {
    if (status === "paid") {
      return { text: "Đã thanh toán", variant: "default" as const };
    }
    return { text: "Chưa thanh toán", variant: "destructive" as const };
  };

  const statusInfo = getStatusVariant(appointment.status);
  const paymentStatusInfo = getPaymentStatusInfo(appointment.paymentStatus);

  const handleConfirmCancel = (reason: string) => {
    onCancel(appointment.id, reason);
    setIsCancelModalOpen(false);
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
            <Badge variant={statusInfo}>
              {appointment.status === "upcoming" && "Sắp tới"}
              {appointment.status === "completed" && "Đã hoàn thành"}
              {appointment.status === "cancelled" && "Đã hủy"}
            </Badge>
            <Badge variant={paymentStatusInfo.variant}>
              {paymentStatusInfo.text}
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
            {treatmentPackage && treatmentPlan && (
              <div className="mb-3 p-2 bg-muted/50 rounded-md text-sm">
                <p className="font-semibold text-primary">
                  Thuộc liệu trình: {treatmentPlan.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  (Gói mua ngày:{" "}
                  {new Date(treatmentPackage.purchaseDate).toLocaleDateString(
                    "vi-VN"
                  )}
                  )
                </p>
              </div>
            )}
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

            {appointment.status === "completed" &&
              appointment.technicianNotes && (
                <>
                  <Separator className="my-3" />
                  <p className="font-semibold">Ghi chú từ Kỹ thuật viên:</p>
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-2 mt-1">
                    {appointment.technicianNotes}
                  </p>
                </>
              )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {appointment.status === "upcoming" && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsCancelModalOpen(true)}
              >
                Hủy lịch hẹn
              </Button>
              <Button asChild>
                <Link
                  href={`/booking?rescheduleId=${appointment.id}&serviceId=${service.id}`}
                >
                  Thay đổi lịch
                </Link>
              </Button>
            </>
          )}
          {appointment.status === "completed" && !hasReviewed && (
            <Button onClick={() => onReview(appointment)}>Viết đánh giá</Button>
          )}
          {appointment.status === "completed" && hasReviewed && (
            <Button variant="outline" disabled>
              Đã đánh giá
            </Button>
          )}
        </CardFooter>
      </Card>

      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
};

export default AppointmentCard;
