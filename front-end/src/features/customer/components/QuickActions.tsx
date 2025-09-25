"use client";

import React from "react";
import { Button } from "@/features/shared/components/ui/button";
import { UserCheck, Bell, CalendarPlus, BarChart } from "lucide-react";
import Link from "next/link";

export const QuickActions = () => {
  return (
    <div className="bg-card p-4 rounded border border-border">
      <h3 className="text-lg font-semibold mb-4 text-card-foreground">
        Thao tác nhanh
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          asChild // Cho phép Button hoạt động như một Link
          variant="outline"
          className="bg-muted p-4 h-auto flex-col gap-2 hover:bg-accent"
        >
          <Link href="/manage-appointments/check-in">
            <UserCheck className="w-6 h-6" />
            <span className="text-sm">Check-in hàng loạt</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="bg-muted p-4 h-auto flex-col gap-2 hover:bg-accent"
        >
          <Bell className="w-6 h-6" />
          <span className="text-sm">Gửi thông báo</span>
        </Button>
        <Button
          variant="outline"
          className="bg-muted p-4 h-auto flex-col gap-2 hover:bg-accent"
        >
          <CalendarPlus className="w-6 h-6" />
          <span className="text-sm">Đặt lịch mới</span>
        </Button>
        <Button
          variant="outline"
          className="bg-muted p-4 h-auto flex-col gap-2 hover:bg-accent"
        >
          <BarChart className="w-6 h-6" />
          <span className="text-sm">Xem báo cáo</span>
        </Button>
      </div>
    </div>
  );
};
