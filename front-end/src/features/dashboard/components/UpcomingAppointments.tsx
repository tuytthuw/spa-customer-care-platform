"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import { getCustomers } from "@/features/customer/api/customer.api";
import { getServices } from "@/features/service/api/service.api";
import { Appointment } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";

export function UpcomingAppointments() {
  // 1. Fetch dữ liệu cần thiết
  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    Customer[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: services = [], isLoading: loadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const isLoading = loadingAppointments || loadingCustomers || loadingServices;

  // 2. Lọc và sắp xếp dữ liệu từ API
  const upcoming = appointments
    .filter((a) => a.status === "upcoming")
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch hẹn sắp tới</CardTitle>
        <CardDescription>
          Đây là 5 lịch hẹn tiếp theo trong ngày.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p>Đang tải lịch hẹn...</p>
        ) : upcoming.length > 0 ? (
          upcoming.map((appt) => {
            const customer = customers.find((c) => c.id === appt.customerId);
            const service = services.find((s) => s.id === appt.serviceId);

            // Nếu không tìm thấy customer hoặc service, không hiển thị gì
            if (!customer || !service) return null;

            return (
              <div key={appt.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={
                      customer.avatar ||
                      `https://api.dicebear.com/7.x/notionists/svg?seed=${customer.id}`
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {service.name}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {new Date(appt.start).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            Không có lịch hẹn nào sắp tới.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
