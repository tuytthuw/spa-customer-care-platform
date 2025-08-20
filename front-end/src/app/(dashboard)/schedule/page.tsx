// src/app/(dashboard)/schedule/page.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/auth-context";
import { mockAppointments } from "@/lib/mock-data";
import { Clock, User, Scissors } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho một lịch hẹn (để code chặt chẽ hơn)
type Appointment = (typeof mockAppointments)[0];

const SchedulePage = () => {
  // Giả sử user đã đăng nhập và là kỹ thuật viên
  // Trong thực tế, bạn sẽ lấy user từ useAuth()
  const mockTechnician = { id: "tech-01", name: "Trần Thị B" };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Lọc các lịch hẹn của kỹ thuật viên này
  const technicianAppointments = mockAppointments.filter(
    (app) => app.technicianId === mockTechnician.id
  );

  // Lọc các lịch hẹn cho ngày đã chọn
  const appointmentsForSelectedDay = technicianAppointments.filter((app) => {
    if (!selectedDate) return false;
    const appointmentDate = new Date(app.date);
    // So sánh ngày, tháng, năm (bỏ qua giờ)
    return (
      appointmentDate.getDate() === selectedDate.getDate() &&
      appointmentDate.getMonth() === selectedDate.getMonth() &&
      appointmentDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Component nhỏ để hiển thị chi tiết một lịch hẹn
  const AppointmentItem = ({ appointment }: { appointment: Appointment }) => (
    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex justify-between items-center">
        <div className="font-semibold">{appointment.serviceName}</div>
        <div className="text-sm font-medium text-primary">
          {appointment.time}
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2 space-y-1">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          Khách hàng: {appointment.customerName}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cột Lịch */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Lịch của bạn</CardTitle>
            <CardDescription>Chọn một ngày để xem chi tiết.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border p-0"
            />
          </CardContent>
        </Card>
      </div>

      {/* Cột Danh sách Lịch hẹn */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Lịch hẹn ngày{" "}
              {selectedDate ? selectedDate.toLocaleDateString("vi-VN") : ""}
            </CardTitle>
            <CardDescription>
              Bạn có {appointmentsForSelectedDay.length} cuộc hẹn trong ngày
              này.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentsForSelectedDay.length > 0 ? (
              <div className="space-y-4">
                {appointmentsForSelectedDay
                  .sort((a, b) => a.time.localeCompare(b.time)) // Sắp xếp theo giờ
                  .map((app) => (
                    <AppointmentItem key={app.id} appointment={app} />
                  ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Không có lịch hẹn nào trong ngày này.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulePage;
