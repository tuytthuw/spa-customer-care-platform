import { mockAppointments, mockCustomers, mockServices } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UpcomingAppointments() {
  // Lấy 5 lịch hẹn sắp tới gần nhất
  const upcoming = mockAppointments
    .filter((a) => a.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
        {upcoming.map((appt) => {
          const customer = mockCustomers.find((c) => c.id === "cus-1"); // Giả sử cùng 1 khách
          const service = mockServices.find((s) => s.id === appt.serviceId);
          return (
            <div key={appt.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/images/avatars/avatar-1.jpg" alt="Avatar" />
                <AvatarFallback>{customer?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {customer?.name}
                </p>
                <p className="text-sm text-muted-foreground">{service?.name}</p>
              </div>
              <div className="ml-auto font-medium">
                {new Date(appt.date).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
