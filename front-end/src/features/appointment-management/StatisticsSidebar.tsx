"use client";

import React from "react";
import { mockStaff } from "@/lib/mock-data";
import Image from "next/image";

export const StatisticsSidebar = () => {
  const today = new Date();
  const dateString = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <div className="w-64 bg-muted border-r border-border p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Hôm nay</h2>
        <p className="text-muted-foreground">{dateString}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm uppercase text-muted-foreground mb-2 font-semibold">
          Thống kê
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card p-3 rounded border border-border">
            <p className="text-sm text-muted-foreground">Tổng lịch hẹn</p>
            <p className="text-xl font-bold">12</p>
          </div>
          <div className="bg-card p-3 rounded border border-border">
            <p className="text-sm text-muted-foreground">Đã check-in</p>
            <p className="text-xl font-bold">5</p>
          </div>
          <div className="bg-card p-3 rounded border border-border">
            <p className="text-sm text-muted-foreground">Đang chờ</p>
            <p className="text-xl font-bold">4</p>
          </div>
          <div className="bg-card p-3 rounded border border-border">
            <p className="text-sm text-muted-foreground">Hoàn tất</p>
            <p className="text-xl font-bold">3</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm uppercase text-muted-foreground mb-2 font-semibold">
          Nhân viên
        </h3>
        <div className="space-y-2">
          {mockStaff.slice(0, 4).map((staff) => (
            <div key={staff.id} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  staff.status === "active" ? "bg-green-500" : "bg-muted"
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
                  staff.status === "active" ? "" : "text-muted-foreground"
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
