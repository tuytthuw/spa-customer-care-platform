"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { Button } from "@/features/shared/components/ui/button";
import Image from "next/image";
import { Clock, Check, Play, Pause } from "lucide-react";
import { Badge } from "@/features/shared/components/ui/badge";
import {
  updateAppointmentStatus,
  logAppointmentCompletion,
} from "@/features/appointment/api/appointment.api";
import LogStatusModal from "@/features/technician/components/LogStatusModal";

interface TodaysAppointmentCardProps {
  appointment: Appointment;
  customer: Customer;
  service: Service;
}

const getAppointmentTimes = (date: string, duration: number) => {
  const startTime = new Date(date);
  const endTime = new Date(startTime.getTime() + duration * 60000);
  const formatTime = (d: Date) =>
    d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return {
    start: formatTime(startTime),
    end: formatTime(endTime),
  };
};

export default function TodaysAppointmentCard({
  appointment,
  customer,
  service,
}: TodaysAppointmentCardProps) {
  const queryClient = useQueryClient();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const { start, end } = getAppointmentTimes(
    appointment.start,
    service.duration
  );

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: "in-progress" | "paused" }) =>
      updateAppointmentStatus(appointment.id, status),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái lịch hẹn thành công!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    },
  });

  const logCompletionMutation = useMutation({
    mutationFn: ({ notes }: { notes: string }) =>
      logAppointmentCompletion(appointment.id, notes),
    onSuccess: () => {
      toast.success("Đã ghi nhận hoàn thành lịch hẹn!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setIsLogModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    },
  });

  const getStatusInfo = () => {
    switch (appointment.status) {
      case "upcoming":
        return {
          text: "Chờ thực hiện",
          variant: "default" as const,
        };
      case "completed":
        return {
          text: "Đã hoàn thành",
          variant: "secondary" as const,
        };
      case "in-progress":
        return {
          text: "Đang thực hiện",
          variant: "default" as const,
        };
      case "paused":
        return {
          text: "Đang tạm dừng",
          variant: "outline" as const,
        };
      case "cancelled":
        return {
          text: "Đã hủy",
          variant: "destructive" as const,
        };
      default:
        return {
          text: "Chờ thực hiện",
          variant: "secondary" as const,
        };
    }
  };
  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex items-center space-x-4">
            <Image
              src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${customer.id}`}
              alt="Customer"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-xl text-foreground">{customer.name}</h3>
              <p className="text-lg text-muted-foreground">{customer.phone}</p>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3">
            <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
            <div className="text-right">
              <p className="text-lg text-foreground">
                {start} - {end}
              </p>
              <p className="text-sm text-muted-foreground">
                {service.duration} phút
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h4 className="text-base md:text-lg text-foreground mb-3">
              Dịch vụ
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm md:text-base text-foreground">
                  {service.name}
                </span>
                <span className="text-sm md:text-base text-foreground">
                  {service.duration} phút
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-base md:text-lg text-foreground mb-3">
              Ghi chú
            </h4>
            <div className="p-4 bg-muted rounded-lg min-h-[80px]">
              <p className="text-sm md:text-base text-muted-foreground">
                {appointment.customerNote || "Không có ghi chú từ khách hàng."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          {appointment.status === "upcoming" && (
            <Button
              onClick={() =>
                updateStatusMutation.mutate({ status: "in-progress" })
              }
              disabled={updateStatusMutation.isPending}
            >
              <Play className="mr-2 h-4 w-4" />
              Bắt đầu
            </Button>
          )}

          {/* --- KHỐI LOGIC MỚI CHO NÚT TẠM DỪNG/TIẾP TỤC --- */}
          {(appointment.status === "in-progress" ||
            appointment.status === "paused") && (
            <Button
              variant="outline"
              onClick={() => {
                const nextStatus =
                  appointment.status === "in-progress"
                    ? "paused"
                    : "in-progress";
                updateStatusMutation.mutate({ status: nextStatus });
              }}
              disabled={updateStatusMutation.isPending}
            >
              {appointment.status === "in-progress" ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Tạm dừng
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Tiếp tục
                </>
              )}
            </Button>
          )}

          {appointment.status === "in-progress" && (
            <Button onClick={() => setIsLogModalOpen(true)}>
              <Check className="mr-2 h-4 w-4" />
              Hoàn thành
            </Button>
          )}
        </div>
      </div>
      <LogStatusModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        appointment={appointment}
        onSave={(appointmentId, notes) =>
          logCompletionMutation.mutate({ notes })
        }
      />
    </>
  );
}
