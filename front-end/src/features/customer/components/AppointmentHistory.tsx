"use client";
import { Appointment } from "@/features/appointment/types";
import { useServices } from "@/features/service/hooks/useServices";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/shared/components/ui/table";
import { Badge } from "@/features/shared/components/ui/badge";
import { Spinner } from "@/features/shared/components/ui/spinner";

// Component giờ sẽ nhận appointments làm prop
interface AppointmentHistoryProps {
  appointments: Appointment[];
}

export default function AppointmentHistory({
  appointments,
}: AppointmentHistoryProps) {
  // Vẫn cần tải services và staffs để map tên
  const { data: services, isLoading: isLoadingServices } = useServices();
  const { data: staffs, isLoading: isLoadingStaffs } = useStaffs();

  if (isLoadingServices || isLoadingStaffs) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    );
  }

  const getServiceName = (serviceId: string) => {
    return services?.find((s) => s.id === serviceId)?.name || "N/A";
  };

  const getTechnicianName = (technicianId?: string) => {
    return staffs?.find((s) => s.id === technicianId)?.name || "N/A";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ngày</TableHead>
          <TableHead>Dịch vụ</TableHead>
          <TableHead>Kỹ thuật viên</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appt) => (
          <TableRow key={appt.id}>
            <TableCell>
              {new Date(appt.start).toLocaleDateString("vi-VN")}
            </TableCell>
            <TableCell>{getServiceName(appt.serviceId)}</TableCell>
            <TableCell>{getTechnicianName(appt.technicianId)}</TableCell>
            <TableCell>
              <Badge>{appt.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
