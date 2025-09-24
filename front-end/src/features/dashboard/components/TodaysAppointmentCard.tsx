import { Appointment } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { Button } from "@/features/shared/components/ui/button";
import Image from "next/image";
import { Clock, Check, Play } from "lucide-react";
import { Badge } from "@/features/shared/components/ui/badge";
import { VariantProps } from "class-variance-authority";

interface TodaysAppointmentCardProps {
  appointment: Appointment;
  customer: Customer;
  service: Service;
}

const getAppointmentTimes = (date: string, duration: number) => {
  const startTime = new Date(date);
  const endTime = new Date(startTime.getTime() + duration * 60000);
  const formatTime = (d: Date) =>
    d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return {
    start: formatTime(startTime),
    end: formatTime(endTime),
  };
};

export default function TodaysAppointmentCard({
  appointment,
  customer,
  service,
}: TodaysAppointmentCardProps) {
  const { start, end } = getAppointmentTimes(
    appointment.date,
    service.duration
  );

  const getStatusInfo = () => {
    switch (appointment.status) {
      case "upcoming":
        return {
          text: "Chờ thực hiện",
          variant: "default" as const,
        };
      case "completed":
        return {
          text: "Đã hoàn thành",
          variant: "secondary" as const,
        };
      case "in-progress":
        return {
          text: "Đang thực hiện",
          variant: "default" as const, // You might want a different color, e.g., a blue one
        };
      case "cancelled":
        return {
          text: "Đã hủy",
          variant: "destructive" as const,
        };
      default:
        return {
          text: "Chờ thực hiện",
          variant: "secondary" as const,
        };
    }
  };
  const statusInfo = getStatusInfo();

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex items-center space-x-4">
          <Image
            src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${customer.id}`}
            alt="Customer"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-xl text-foreground">{customer.name}</h3>
            <p className="text-lg text-muted-foreground">{customer.phone}</p>
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
          <div className="text-right">
            <p className="text-lg text-foreground">
              {start} - {end}
            </p>
            <p className="text-sm text-muted-foreground">
              {service.duration} phút
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <h4 className="text-base md:text-lg text-foreground mb-3">Dịch vụ</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm md:text-base text-foreground">
                {service.name}
              </span>
              <span className="text-sm md:text-base text-foreground">
                {service.duration} phút
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-base md:text-lg text-foreground mb-3">Ghi chú</h4>
          <div className="p-4 bg-muted rounded-lg min-h-[80px]">
            <p className="text-sm md:text-base text-muted-foreground">
              {appointment.customerNote || "Không có ghi chú từ khách hàng."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        {appointment.status === "upcoming" && (
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Bắt đầu
          </Button>
        )}
        {appointment.status === "in-progress" && (
          <>
            <Button variant="outline">Tạm dừng</Button>
            <Button>
              <Check className="mr-2 h-4 w-4" />
              Hoàn thành
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
