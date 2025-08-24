"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { mockCustomers, mockServices, mockStaff } from "@/lib/mock-data";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Appointment, AppointmentStatus } from "@/types/appointment"; // Import types
import Link from "next/link"; // Import Link

// Component nhận props từ cha
interface AppointmentDetailsProps {
  appointment: Appointment | null;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}

export const AppointmentDetails = ({
  appointment,
  onStatusChange,
}: AppointmentDetailsProps) => {
  // Nếu không có lịch hẹn nào được chọn, hiển thị thông báo
  if (!appointment) {
    return (
      <div className="w-80 bg-card border-l border-border p-4 flex items-center justify-center">
        <p className="text-muted-foreground">
          Chọn một lịch hẹn để xem chi tiết
        </p>
      </div>
    );
  }

  // Lấy dữ liệu dựa trên appointment được truyền vào
  const customer = mockCustomers[0];
  const service = mockServices.find((s) => s.id === appointment.serviceId);
  const staff = mockStaff[0];

  return (
    <div className="w-80 bg-card border-l border-border p-4 overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Chi tiết lịch hẹn</h3>
      <div className="flex items-center mb-4">
        <Image
          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${customer.id}`}
          alt="Avatar"
          width={48}
          height={48}
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h4>{customer.name}</h4>
          <p className="text-sm text-muted-foreground">
            Khách hàng thường xuyên
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Dịch vụ</p>
          <p>
            {service?.name} ({service?.duration} phút)
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Thời gian</p>
          <p>
            {new Date(appointment.date).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Nhân viên phục vụ</p>
          <div className="flex items-center">
            <Image
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${staff.id}`}
              alt="Avatar"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span>{staff.name}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Trạng thái</p>
          <p>
            <span className="inline-block bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs capitalize">
              {appointment.status.replace("-", " ")}
            </span>
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Giá dịch vụ</p>
          <p>
            {new Intl.NumberFormat("vi-VN").format(service?.price || 0)} VNĐ
          </p>
        </div>
      </div>

      {/* Logic hiển thị nút bấm dựa trên trạng thái */}
      <div className="space-y-2 mb-6">
        {appointment.status === "upcoming" && (
          <Button
            className="w-full"
            onClick={() => onStatusChange(appointment.id, "checked-in")}
          >
            Check-in
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
        {["checked-in", "in-progress"].includes(appointment.status) && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onStatusChange(appointment.id, "completed")}
          >
            Hoàn thành
          </Button>
        )}
        {appointment.status === "completed" && (
          <Link href={`/dashboard/billing/${appointment.id}`} passHref>
            <Button className="w-full">Đi đến thanh toán</Button>
          </Link>
        )}
        <Button variant="outline" className="w-full">
          Đổi lịch hẹn
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onStatusChange(appointment.id, "cancelled")}
        >
          Hủy lịch hẹn
        </Button>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Ghi chú</h4>
        <Textarea
          className="w-full"
          placeholder="Thêm ghi chú về khách hàng..."
        />
      </div>
    </div>
  );
};
