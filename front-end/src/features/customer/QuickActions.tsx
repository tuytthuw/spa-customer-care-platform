"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, Bell, CalendarPlus, BarChart } from "lucide-react";

export const QuickActions = () => {
  return (
    <div className="bg-white p-4 rounded border border-neutral-200">
      <h3 className="text-lg font-semibold mb-4">Thao tác nhanh</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="bg-neutral-100 p-4 h-auto flex-col gap-2 hover:bg-neutral-200"
        >
          <UserCheck className="w-6 h-6" />
          <span className="text-sm">Check-in hàng loạt</span>
        </Button>
        <Button
          variant="outline"
          className="bg-neutral-100 p-4 h-auto flex-col gap-2 hover:bg-neutral-200"
        >
          <Bell className="w-6 h-6" />
          <span className="text-sm">Gửi thông báo</span>
        </Button>
        <Button
          variant="outline"
          className="bg-neutral-100 p-4 h-auto flex-col gap-2 hover:bg-neutral-200"
        >
          <CalendarPlus className="w-6 h-6" />
          <span className="text-sm">Đặt lịch mới</span>
        </Button>
        <Button
          variant="outline"
          className="bg-neutral-100 p-4 h-auto flex-col gap-2 hover:bg-neutral-200"
        >
          <BarChart className="w-6 h-6" />
          <span className="text-sm">Xem báo cáo</span>
        </Button>
      </div>
    </div>
  );
};
