import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewChart } from "@/components/screens/dashboard/OverviewChart";
import { UpcomingAppointments } from "@/components/screens/dashboard/UpcomingAppointments";
import { StatsCard } from "@/components/screens/dashboard/StatsCard";
import { Activity, CalendarCheck, DollarSign, Users } from "lucide-react";

export default function ManagerDashboard() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        {/* Các thẻ thống kê */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Doanh thu hôm nay"
            value="12,500,000đ"
            icon={DollarSign}
            description="+20.1% so với hôm qua"
          />
          <StatsCard
            title="Lịch hẹn hôm nay"
            value="+15"
            icon={CalendarCheck}
            description="3 lịch đã hoàn thành"
          />
          <StatsCard
            title="Khách hàng mới"
            value="+5"
            icon={Users}
            description="+2 so với hôm qua"
          />
          <StatsCard
            title="Tỷ lệ lấp đầy"
            value="75%"
            icon={Activity}
            description="Dựa trên lịch làm việc"
          />
        </div>

        {/* Biểu đồ và Lịch hẹn sắp tới */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Tổng quan</CardTitle>
              <CardDescription>Số lịch hẹn trong tuần này.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <OverviewChart />
            </CardContent>
          </Card>
          <div className="col-span-4 lg:col-span-3">
            <UpcomingAppointments />
          </div>
        </div>
      </div>
    </div>
  );
}
