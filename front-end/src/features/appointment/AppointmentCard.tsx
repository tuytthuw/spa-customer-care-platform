"use client";

import { Appointment } from "@/types/appointment";
import { mockServices } from "@/lib/mock-data";
import { mockTechnicians } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, BadgeCheck, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (appointmentId: string) => void;
}

export default function AppointmentCard({
  appointment,
  onCancel,
}: AppointmentCardProps) {
  const service = mockServices.find((s) => s.id === appointment.serviceId);
  const technician = mockTechnicians.find(
    (t) => t.id === appointment.technicianId
  );

  if (!service) return null;

  const getStatusBadge = () => {
    switch (appointment.status) {
      case "upcoming":
        return (
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
            Sắp tới
          </span>
        );
      case "completed":
        return (
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
            Đã hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
            Đã hủy
          </span>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(appointment.date).toLocaleString("vi-VN", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Kỹ thuật viên: {technician?.name || "Hệ thống sắp xếp"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <span className="font-semibold text-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(service.price)}
          </span>
        </div>
      </CardContent>
      {appointment.status === "upcoming" && (
        <CardFooter className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <XCircle className="w-4 h-4 mr-2" />
                Hủy lịch
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc chắn muốn hủy lịch hẹn?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Lịch hẹn của bạn sẽ bị hủy
                  vĩnh viễn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Không</AlertDialogCancel>
                <AlertDialogAction onClick={() => onCancel(appointment.id)}>
                  Vâng, hủy lịch
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
      {appointment.status === "completed" && (
        <CardFooter className="flex justify-end">
          <Button variant="outline">
            <BadgeCheck className="w-4 h-4 mr-2" />
            Đánh giá
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
