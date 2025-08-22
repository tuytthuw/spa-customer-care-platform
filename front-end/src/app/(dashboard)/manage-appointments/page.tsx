"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, MoreVertical } from "lucide-react";
import {
  mockAppointments,
  mockCustomers,
  mockServices,
  mockStaff,
} from "@/lib/mock-data";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

// --- Components con được định nghĩa ngay trong file cho tiện ---

// Sidebar Trái: Thống kê và Nhân viên
const StatisticsSidebar = () => {
  const today = new Date();
  const dateString = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <div className="w-64 bg-neutral-50 border-r border-neutral-200 p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Hôm nay</h2>
        <p className="text-neutral-500">{dateString}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm uppercase text-neutral-500 mb-2 font-semibold">
          Thống kê
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-3 rounded border border-neutral-200">
            <p className="text-sm text-neutral-500">Tổng lịch hẹn</p>
            <p className="text-xl font-bold">12</p>
          </div>
          <div className="bg-white p-3 rounded border border-neutral-200">
            <p className="text-sm text-neutral-500">Đã check-in</p>
            <p className="text-xl font-bold">5</p>
          </div>
          <div className="bg-white p-3 rounded border border-neutral-200">
            <p className="text-sm text-neutral-500">Đang chờ</p>
            <p className="text-xl font-bold">4</p>
          </div>
          <div className="bg-white p-3 rounded border border-neutral-200">
            <p className="text-sm text-neutral-500">Hoàn tất</p>
            <p className="text-xl font-bold">3</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm uppercase text-neutral-500 mb-2 font-semibold">
          Nhân viên
        </h3>
        <div className="space-y-2">
          {mockStaff.slice(0, 4).map((staff) => (
            <div key={staff.id} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  staff.status === "active" ? "bg-green-500" : "bg-neutral-300"
                }`}
              ></div>
              <Image
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${staff.id}`}
                alt="Avatar"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span
                className={`text-sm ${
                  staff.status === "active" ? "" : "text-neutral-500"
                }`}
              >
                {staff.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Content: Dòng thời gian Lịch hẹn
const AppointmentTimeline = () => {
  // Giả lập các khung giờ
  const timeSlots = ["9:00", "10:00", "11:00", "12:00", "13:00"];

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl mr-4 font-bold">Lịch hẹn</h2>
          <div className="flex border border-neutral-300 rounded-md">
            <Button
              variant="default"
              className="rounded-r-none bg-neutral-800 text-white"
            >
              Ngày
            </Button>
            <Button variant="ghost" className="rounded-l-none">
              Tuần
            </Button>
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button className="bg-neutral-800 text-white">Hôm nay</Button>
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
            <div className="col-span-1 text-neutral-500 pt-1">{time}</div>
            <div className="col-span-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full border-t border-neutral-200 pt-4">
              {/* Render appointment cards here based on time */}
              {mockAppointments
                .filter((a) => new Date(a.date).getHours() === parseInt(time))
                .map((app) => {
                  const customer = mockCustomers.find((c) =>
                    c.id.startsWith("cus-")
                  );
                  const service = mockServices.find(
                    (s) => s.id === app.serviceId
                  );
                  return (
                    <div
                      key={app.id}
                      className="bg-neutral-100 rounded p-3 border-l-4 border-neutral-800"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{customer?.name}</span>
                        <span className="text-xs bg-white text-neutral-800 px-2 py-0.5 rounded-full">
                          {app.status === "upcoming" ? "Chờ" : "Check-in"}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">
                        {service?.name} ({service?.duration} phút)
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-neutral-500">
                          {new Date(app.date).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <div>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs h-auto px-2 py-1 mr-1"
                          >
                            <Check className="mr-1 h-3 w-3" /> Check-in
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sidebar Phải: Chi tiết Lịch hẹn
const AppointmentDetails = () => {
  // Lấy dữ liệu giả của một lịch hẹn để hiển thị
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

// Component chính của trang
export default function AppointmentsManagementPage() {
  return (
    <div className="flex h-full">
      <StatisticsSidebar />
      <AppointmentTimeline />
      <AppointmentDetails />
    </div>
  );
}
