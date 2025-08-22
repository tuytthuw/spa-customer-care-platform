import { Appointment } from "@/types/appointment";
import { Customer } from "@/types/customer";
import { Service } from "@/types/service";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Clock, Check, Play } from "lucide-react";

interface TodaysAppointmentCardProps {
  appointment: Appointment;
  customer: Customer;
  service: Service;
}

// Hàm để lấy thời gian bắt đầu và kết thúc
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
          icon: <Clock className="mr-2" />,
          color: "bg-yellow-100 text-yellow-800",
        };
      case "completed":
        return {
          text: "Đã hoàn thành",
          icon: <Check className="mr-2" />,
          color: "bg-green-100 text-green-800",
        };
      case "cancelled": // Giả sử có trạng thái "Đang thực hiện"
        return {
          text: "Đang thực hiện",
          icon: <Clock className="mr-2" />,
          color: "bg-blue-100 text-blue-800",
        };
      default:
        return {
          text: "Chờ thực hiện",
          icon: <Clock className="mr-2" />,
          color: "bg-neutral-100 text-neutral-800",
        };
    }
  };
  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Image
            src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${customer.id}`}
            alt="Customer"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-xl text-neutral-900">{customer.name}</h3>
            <p className="text-lg text-neutral-600">{customer.phone}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${statusInfo.color}`}
          >
            {statusInfo.icon}
            {statusInfo.text}
          </span>
          <div className="text-right">
            <p className="text-lg text-neutral-900">
              {start} - {end}
            </p>
            <p className="text-sm text-neutral-500">{service.duration} phút</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg text-neutral-900 mb-3">Dịch vụ</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="text-base text-neutral-900">{service.name}</span>
              <span className="text-base text-neutral-900">
                {service.duration} phút
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-lg text-neutral-900 mb-3">Ghi chú</h4>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-base text-neutral-700">
              Khách hàng có da nhạy cảm, tránh sử dụng tinh dầu mạnh. Ưu tiên
              massage nhẹ nhàng.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        {appointment.status === "upcoming" && (
          <Button className="px-6 py-3 bg-neutral-600 text-white rounded-lg text-base hover:bg-neutral-700">
            <Play className="mr-2 h-4 w-4" />
            Bắt đầu
          </Button>
        )}
        {appointment.status === "cancelled" && (
          <>
            <Button
              variant="outline"
              className="px-6 py-3 rounded-lg text-base"
            >
              Tạm dừng
            </Button>
            <Button className="px-6 py-3 bg-neutral-600 text-white rounded-lg text-base hover:bg-neutral-700">
              <Check className="mr-2 h-4 w-4" />
              Hoàn thành
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
