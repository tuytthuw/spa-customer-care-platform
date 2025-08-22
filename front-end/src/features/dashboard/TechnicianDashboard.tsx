import TodaysAppointmentCard from "@/features/dashboard/TodaysAppointmentCard";
import { mockAppointments, mockCustomers, mockServices } from "@/lib/mock-data";

// Lọc các lịch hẹn cho "hôm nay" để hiển thị (giả lập)
const todaysAppointments = mockAppointments.slice(0, 3);

export default function TechnicianDashboard() {
  const today = new Date();
  const dateString = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Giả lập dữ liệu thống kê
  const totalCustomers = todaysAppointments.length;
  const inProgressCount = todaysAppointments.filter(
    (a) => a.status === "upcoming"
  ).length;
  const completedCount = todaysAppointments.filter(
    (a) => a.status === "completed"
  ).length;

  return (
    <main className="bg-muted min-h-screen -m-6 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-foreground">Lịch Hẹn Hôm Nay</h2>
              <div className="text-lg text-muted-foreground">{dateString}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl text-muted-foreground">
                  {totalCustomers}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tổng khách hàng
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl text-muted-foreground">
                  {inProgressCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Đang thực hiện
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl text-muted-foreground">
                  {completedCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Đã hoàn thành
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {todaysAppointments.map((appointment) => {
            const customer = mockCustomers.find((c) => c.id === "cus-1");
            const service = mockServices.find(
              (s) => s.id === appointment.serviceId
            );
            if (!customer || !service) return null;

            return (
              <TodaysAppointmentCard
                key={appointment.id}
                appointment={appointment}
                customer={customer}
                service={service}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
