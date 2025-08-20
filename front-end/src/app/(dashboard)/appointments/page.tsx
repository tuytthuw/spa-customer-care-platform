"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types/appointment";
import { mockAppointments } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/components/screens/appointments/AppointmentCard";

// Mô phỏng việc gọi API
const fetchAppointments = async (): Promise<Appointment[]> => {
  return Promise.resolve(mockAppointments);
};

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      const data = await fetchAppointments();
      setAppointments(data);
      setIsLoading(false);
    };
    loadAppointments();
  }, []);

  const handleCancelAppointment = (appointmentId: string) => {
    // Đây là nơi bạn sẽ gọi API để hủy lịch
    // Với dữ liệu giả, chúng ta sẽ cập nhật trạng thái
    setAppointments((currentAppointments) =>
      currentAppointments.map((appt) =>
        appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt
      )
    );
    console.log("Đã hủy lịch hẹn:", appointmentId);
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "upcoming"
  );
  const pastAppointments = appointments.filter((a) => a.status !== "upcoming");

  if (isLoading) {
    return <div>Đang tải lịch hẹn...</div>;
  }

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
