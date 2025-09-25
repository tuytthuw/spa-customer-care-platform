import { Appointment } from "@/features/appointment/types";
import { Staff } from "@/features/staff/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/avatar";
import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatisticsSidebarProps {
  appointments: Appointment[];
  staff: Staff[];
  onStaffSelect: (staffId: string | null) => void;
  selectedStaffId: string | null;
}

const StatisticsSidebar = ({
  appointments,
  staff,
  onStaffSelect,
  selectedStaffId,
}: StatisticsSidebarProps) => {
  const totalAppointments = appointments.length;
  const waitingAppointments = appointments.filter(
    (a) => a.status === "checked-in"
  ).length;
  const inServiceAppointments = appointments.filter(
    (a) => a.status === "in-progress"
  ).length;

  // SỬA LỖI: Logic để xác định kỹ thuật viên bận/rảnh
  const now = new Date();

  // Lấy ID của các kỹ thuật viên đang có lịch hẹn diễn ra
  const busyTechnicianIds = new Set(
    appointments
      .filter((appt) => {
        const startTime = new Date(appt.start);
        const endTime = new Date(appt.end);
        return appt.technicianId && now >= startTime && now < endTime;
      })
      .map((appt) => appt.technicianId)
  );

  // Lọc danh sách nhân viên để chỉ lấy kỹ thuật viên
  const technicians = staff.filter((s) => s.role === "technician");

  // Chia kỹ thuật viên thành 2 nhóm: bận và rảnh
  const availableTechnicians = technicians.filter(
    (tech) => !busyTechnicianIds.has(tech.id)
  );
  const busyTechnicians = technicians.filter((tech) =>
    busyTechnicianIds.has(tech.id)
  );

  return (
    <div className="w-full lg:w-80 border-l p-4 space-y-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>Thống kê trong ngày</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Tổng số lịch hẹn:</span>
            <span className="font-bold">{totalAppointments}</span>
          </div>
          <div className="flex justify-between">
            <span>Đang chờ:</span>
            <span className="font-bold">{waitingAppointments}</span>
          </div>
          <div className="flex justify-between">
            <span>Đang thực hiện:</span>
            <span className="font-bold">{inServiceAppointments}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Kỹ thuật viên sẵn sàng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold">{availableTechnicians.length}</p>
          <div className="mt-4 space-y-2">
            {availableTechnicians.map((s) => (
              <div
                key={s.id}
                onClick={() => onStaffSelect(s.id)}
                className={cn(
                  "flex items-center p-2 rounded-md cursor-pointer hover:bg-muted",
                  selectedStaffId === s.id && "bg-muted"
                )}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={s.avatar} />
                  <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Kỹ thuật viên đang bận</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold">{busyTechnicians.length}</p>
          <div className="mt-4 space-y-2">
            {busyTechnicians.map((s) => (
              <div
                key={s.id}
                onClick={() => onStaffSelect(s.id)}
                className={cn(
                  "flex items-center p-2 rounded-md cursor-pointer hover:bg-muted",
                  selectedStaffId === s.id && "bg-muted"
                )}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={s.avatar} />
                  <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{s.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  Đang bận
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsSidebar;
