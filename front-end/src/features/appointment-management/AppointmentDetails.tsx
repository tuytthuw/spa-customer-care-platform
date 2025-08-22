"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  mockAppointments,
  mockCustomers,
  mockServices,
  mockStaff,
} from "@/lib/mock-data";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

export const AppointmentDetails = () => {
  // Dữ liệu giả cho một cuộc hẹn cụ thể
  const appointment = mockAppointments[0];
  const customer = mockCustomers[0];
  const service = mockServices.find((s) => s.id === appointment.serviceId);
  const staff = mockStaff[0];

  return (
    <div className="w-80 bg-white border-l border-neutral-200 p-4 overflow-auto">
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
          <p className="text-sm text-neutral-500">Khách hàng thường xuyên</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-neutral-500">Dịch vụ</p>
          <p>
            {service?.name} ({service?.duration} phút)
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Thời gian</p>
          <p>
            {new Date(appointment.date).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Nhân viên phục vụ</p>
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
          <p className="text-sm text-neutral-500">Trạng thái</p>
          <p>
            <span className="inline-block bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full text-xs">
              Chờ
            </span>
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Giá dịch vụ</p>
          <p>
            {new Intl.NumberFormat("vi-VN").format(service?.price || 0)} VNĐ
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <Button className="w-full bg-neutral-800 text-white hover:bg-neutral-700">
          Check-in
        </Button>
        <Button variant="outline" className="w-full">
          Đổi lịch hẹn
        </Button>
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
        >
          Hủy lịch hẹn
        </Button>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Ghi chú</h4>
        <Textarea
          className="w-full border border-neutral-300 rounded p-2 text-sm h-24"
          placeholder="Thêm ghi chú về khách hàng..."
        />
      </div>
    </div>
  );
};
