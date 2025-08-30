"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Appointment, AppointmentStatus } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { cn } from "@/lib/utils";

interface AppointmentTimelineProps {
  appointments: Appointment[];
  customers: Customer[];
  services: Service[];
  selectedAppointmentId?: string | null;
  onSelectAppointment: (appointment: Appointment) => void;
}

export const AppointmentTimeline = ({
  appointments,
  customers,
  services,
  selectedAppointmentId,
  onSelectAppointment,
}: AppointmentTimelineProps) => {
  const timeSlots = [
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const getStatusInfo = (status: AppointmentStatus) => {
    switch (status) {
      case "upcoming":
        return {
          text: "Sắp tới",
          className:
            "border-[var(--status-warning)] bg-[color-mix(in_oklab,var(--status-warning),transparent_90%)]",
        };
      case "checked-in":
        return {
          text: "Đã check-in",
          className:
            "border-[var(--status-info)] bg-[color-mix(in_oklab,var(--status-info),transparent_90%)]",
        };
      case "in-progress":
        return {
          text: "Đang làm",
          className:
            "border-[var(--status-processing)] bg-[color-mix(in_oklab,var(--status-processing),transparent_90%)]",
        };
      case "completed":
        return {
          text: "Hoàn thành",
          className:
            "border-[var(--status-success)] bg-[color-mix(in_oklab,var(--status-success),transparent_90%)]",
        };
      case "cancelled":
        return {
          text: "Đã hủy",
          className:
            "border-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive),transparent_90%)]",
        };
      default:
        return { text: "Không xác định", className: "border-border bg-muted" };
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl mr-4 font-bold">Lịch hẹn trong ngày</h2>
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button>Hôm nay</Button>
          <Button variant="outline" size="icon" className="ml-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {timeSlots.map((time) => (
          <div
            key={time}
            className="grid grid-cols-12 items-start min-h-[6rem]"
          >
            <div className="col-span-1 text-muted-foreground pt-3">{time}</div>
            <div className="col-span-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full border-t border-border pt-4 -ml-4 pl-4">
              {appointments
                .filter((a) => new Date(a.date).getHours() === parseInt(time))
                .map((app) => {
                  const customer = customers.find(
                    (c) => c.id === app.customerId
                  );
                  const service = services.find((s) => s.id === app.serviceId);
                  const statusInfo = getStatusInfo(app.status);
                  const isSelected = app.id === selectedAppointmentId;

                  if (!customer || !service) return null; // Bỏ qua nếu không tìm thấy thông tin

                  return (
                    <button
                      key={app.id}
                      onClick={() => onSelectAppointment(app)}
                      className={cn(
                        "text-left rounded-lg p-3 border-l-4 transition-all hover:shadow-md",
                        statusInfo.className,
                        isSelected ? "ring-2 ring-primary shadow-lg" : "bg-card"
                      )}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-sm">
                          {customer.name}
                        </span>
                        <span className="text-xs bg-white/50 text-foreground px-2 py-0.5 rounded-full">
                          {statusInfo.text}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {service.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        {new Date(app.date).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
