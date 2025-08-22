"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, MoreVertical } from "lucide-react";
import { mockAppointments, mockCustomers, mockServices } from "@/lib/mock-data";

export const AppointmentTimeline = () => {
  // Giả lập các khung giờ
  const timeSlots = ["9:00", "10:00", "11:00", "12:00", "13:00"];

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl mr-4 font-bold">Lịch hẹn</h2>
          <div className="flex border border-border rounded-md">
            <Button
              variant="default"
              className="rounded-r-none bg-primary text-primary-foreground"
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
          <Button className="bg-primary text-primary-foreground">
            Hôm nay
          </Button>
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
            <div className="col-span-1 text-muted-foreground pt-1">{time}</div>
            <div className="col-span-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full border-t border-border pt-4">
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
                      className="bg-muted rounded p-3 border-l-4 border-primary"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{customer?.name}</span>
                        <span className="text-xs bg-card text-foreground px-2 py-0.5 rounded-full">
                          {app.status === "upcoming" ? "Chờ" : "Check-in"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service?.name} ({service?.duration} phút)
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-muted-foreground">
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
