"use client";

import { useQuery } from "@tanstack/react-query";
import { Appointment } from "@/types/appointment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/features/appointment/AppointmentCard";
import { getAppointments } from "@/services/appointmentService";

export default function AppointmentsPage() {
  // Dùng state để quản lý danh sách lịch hẹn
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useQuery<Appointment[]>({
    queryKey: ["appointments"], // Khóa để cache dữ liệu
    queryFn: getAppointments, // Hàm sẽ được gọi để fetch data
  });

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
    // Chú ý: Ở ứng dụng thật, bạn sẽ dùng useMutation ở đây để gọi API
    // và sau đó vô hiệu hóa query "appointments" để nó tự fetch lại.
    // Tạm thời chúng ta chưa xử lý cập nhật giao diện ngay lập tức.
  };

  // 3. Thêm trạng thái loading và error
  if (isLoading) {
    return <div className="p-8">Đang tải lịch hẹn của bạn...</div>;
  }

  if (error) {
    return <div className="p-8">Đã xảy ra lỗi khi tải dữ liệu.</div>;
  }

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
