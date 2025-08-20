// src/app/(dashboard)/appointments/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAppointments } from "@/lib/mock-data"; // Import dữ liệu giả

// Component để hiển thị một lịch hẹn
const AppointmentCard = ({
  appointment,
}: {
  appointment: (typeof mockAppointments)[0];
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 border rounded-lg flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{appointment.serviceName}</h3>
        <p className="text-sm text-gray-600">
          Kỹ thuật viên: {appointment.technician}
        </p>
        <p className="text-sm text-gray-500">
          Thời gian: {appointment.time} -{" "}
          {new Date(appointment.date).toLocaleDateString("vi-VN")}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
            appointment.status
          )}`}
        >
          {appointment.status === "completed"
            ? "Đã hoàn thành"
            : appointment.status === "upcoming"
            ? "Sắp tới"
            : "Đã hủy"}
        </span>
        {appointment.status === "upcoming" && (
          <Button variant="destructive" size="sm">
            Hủy Lịch
          </Button>
        )}
        {appointment.status === "completed" && (
          <Button variant="outline" size="sm">
            Đánh Giá
          </Button>
        )}
      </div>
    </div>
  );
};

const AppointmentsPage = () => {
  // Logic lấy dữ liệu thật sẽ thay thế ở đây
  const appointments = mockAppointments;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch Hẹn Của Tôi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((app) => (
            <AppointmentCard key={app.id} appointment={app} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsPage;
