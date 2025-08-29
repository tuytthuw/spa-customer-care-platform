"use client";

import React from "react";
import Image from "next/image";
import { Appointment } from "@/types/appointment";
import { Staff } from "@/types/staff"; // Import Staff type

interface StatisticsSidebarProps {
  appointments: Appointment[];
  staff: Staff[]; // Nhận danh sách nhân viên từ props
}

export const StatisticsSidebar = ({
  appointments,
  staff,
}: StatisticsSidebarProps) => {
  const today = new Date();
  const dateString = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const total = appointments.length;
  const checkedIn = appointments.filter(
    (app) => app.status === "checked-in" || app.status === "in-progress"
  ).length;
  const waiting = appointments.filter(
    (app) => app.status === "upcoming"
  ).length;
  const completed = appointments.filter(
    (app) => app.status === "completed"
  ).length;

  return (
    <div className="w-64 bg-card border-r border-border p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Hôm nay</h2>
        <p className="text-muted-foreground">{dateString}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm uppercase text-muted-foreground mb-2 font-semibold">
          Thống kê
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">Tổng lịch hẹn</p>
            <p className="text-xl font-bold">{total}</p>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">Đã check-in</p>
            <p className="text-xl font-bold">{checkedIn}</p>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">Đang chờ</p>
            <p className="text-xl font-bold">{waiting}</p>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">Hoàn tất</p>
            <p className="text-xl font-bold">{completed}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm uppercase text-muted-foreground mb-2 font-semibold">
          Nhân viên
        </h3>
        <div className="space-y-2">
          {/* Sử dụng dữ liệu staff thật */}
          {staff.slice(0, 5).map((s) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  s.status === "active"
                    ? "bg-[var(--status-success)]"
                    : "bg-gray-400"
                }`}
              ></div>
              <Image
                src={
                  s.avatar ||
                  `https://api.dicebear.com/7.x/notionists/svg?seed=${s.id}`
                }
                alt="Avatar"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span
                className={`text-sm ${
                  s.status === "active" ? "" : "text-muted-foreground"
                }`}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
