// src/app/(dashboard)/appointments/page.tsx (PHIÊN BẢN NÂNG CẤP)
"use client";

import { useQuery } from "@tanstack/react-query";
import { Appointment } from "@/types/appointment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/features/appointments/AppointmentCard";
import { getAppointments } from "@/services/appointmentService"; // Import service

export default function MyAppointmentsPage() {
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const handleCancelAppointment = (appointmentId: string) => {
    // Logic này sẽ được nâng cấp bằng useMutation
    console.log("Đã hủy lịch hẹn:", appointmentId);
  };

  if (isLoading) {
    return <div>Đang tải lịch hẹn...</div>;
  }

  if (error) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu: {error.message}</div>;
  }

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "upcoming"
  );
  const pastAppointments = appointments.filter((a) => a.status !== "upcoming");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lịch hẹn của tôi</h1>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onCancel={handleCancelAppointment}
                />
              ))}
            </div>
          ) : (
            <p>Bạn không có lịch hẹn nào sắp tới.</p>
          )}
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onCancel={handleCancelAppointment}
                />
              ))}
            </div>
          ) : (
            <p>Bạn chưa có lịch sử hẹn nào.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
