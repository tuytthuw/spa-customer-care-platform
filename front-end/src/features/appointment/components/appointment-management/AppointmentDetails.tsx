"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Appointment, AppointmentStatus } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}

export const AppointmentDetails = ({
  appointment,
  customers,
  services,
  staff,
  onStatusChange,
}: AppointmentDetailsProps) => {
  if (!appointment) {
    return (
      <div className="w-96 bg-card border-l border-border p-4 flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          Chọn một lịch hẹn để xem chi tiết
        </p>
      </div>
    );
  }

  const customer = customers.find((c) => c.id === appointment.customerId);
  const service = services.find((s) => s.id === appointment.serviceId);
  const technician = staff.find((t) => t.id === appointment.technicianId);

  if (!customer || !service) {
    return (
      <div className="w-96 bg-card border-l border-border p-4 flex items-center justify-center">
        <p className="text-destructive text-center">
          Lỗi: Không tìm thấy thông tin khách hàng hoặc dịch vụ.
        </p>
      </div>
    );
  }

  return (
    <div className="w-96 bg-card border-l border-border p-6 flex flex-col">
      <h3 className="text-xl font-bold mb-4">Chi tiết lịch hẹn</h3>

      <div className="flex items-center mb-4">
        <Image
          src={
            customer.avatar ||
            `https://api.dicebear.com/7.x/notionists/svg?seed=${customer.id}`
          }
          alt="Avatar"
          width={48}
          height={48}
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h4 className="font-semibold">{customer.name}</h4>
          <p className="text-sm text-muted-foreground">
            Lịch sử: {customer.totalAppointments} lần
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4 mb-6 flex-grow">
        <div>
          <p className="text-sm text-muted-foreground">Dịch vụ</p>
          <p className="font-medium">
            {service.name} ({service.duration} phút)
          </p>
        </div>
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
            <p className="text-sm text-muted-foreground">Nhân viên phục vụ</p>
            <p className="font-medium">{technician.name}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">Trạng thái</p>
          <p className="font-medium capitalize">
            {appointment.status.replace("-", " ")}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Ghi chú của khách</p>
          <p className="text-sm italic">&quot;Không có ghi chú.&quot;</p>
        </div>
      </div>

      <div className="space-y-2 mt-auto">
        {appointment.status === "upcoming" && (
          <Button
            className="w-full"
            onClick={() => onStatusChange(appointment.id, "checked-in")}
          >
            Check-in cho khách
          </Button>
        )}
        {appointment.status === "checked-in" && (
          <Button
            className="w-full"
            onClick={() => onStatusChange(appointment.id, "in-progress")}
          >
            Bắt đầu thực hiện
          </Button>
        )}
        {appointment.status === "in-progress" && (
          <Button
            className="w-full"
            onClick={() => onStatusChange(appointment.id, "completed")}
          >
            Hoàn thành
          </Button>
        )}
        {appointment.status === "completed" && (
          <Button asChild className="w-full">
            <Link href={`/billing/${appointment.id}`}>Đi đến thanh toán</Link>
          </Button>
        )}
        {["upcoming", "checked-in"].includes(appointment.status) && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => onStatusChange(appointment.id, "cancelled")}
          >
            Báo hủy
          </Button>
        )}
      </div>
    </div>
  );
};
