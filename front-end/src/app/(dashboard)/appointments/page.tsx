"use client";

import { useState } from "react"; // Thêm useState
import { mockAppointments as initialAppointments } from "@/lib/mock-data";
import { Appointment } from "@/types/appointment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/features/appointment/AppointmentCard";

export default function AppointmentsPage() {
  // Dùng state để quản lý danh sách lịch hẹn
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "upcoming"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled"
  );

  // Hàm xử lý khi hủy lịch hẹn
  const handleCancelAppointment = (id: string, reason: string) => {
    console.log(`Cancelling appointment ${id} for reason: ${reason}`);
    setAppointments((currentAppointments) =>
      currentAppointments.map((app) =>
        app.id === id ? { ...app, status: "cancelled" } : app
      )
    );
    // Ở ứng dụng thực tế, bạn sẽ gọi API để cập nhật trạng thái ở đây
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Lịch hẹn của tôi</h1>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Sắp tới ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã hoàn thành ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Đã hủy ({cancelledAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                />
              ))
            ) : (
              <p>Bạn không có lịch hẹn nào sắp tới.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div className="space-y-4">
            {completedAppointments.length > 0 ? (
              completedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                />
              ))
            ) : (
              <p>Bạn chưa hoàn thành lịch hẹn nào.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <div className="space-y-4">
            {cancelledAppointments.length > 0 ? (
              cancelledAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                />
              ))
            ) : (
              <p>Bạn không có lịch hẹn nào đã hủy.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
