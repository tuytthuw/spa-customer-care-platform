"use client";

import { Appointment } from "@/features/appointment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/shared/components/ui/table";
import { Badge } from "@/features/shared/components/ui/badge";

interface AppointmentHistoryProps {
  appointments: Appointment[];
  services: Service[];
  staff: Staff[];
}

export function AppointmentHistory({
  appointments,
  services,
  staff,
}: AppointmentHistoryProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "in-progress":
        return "outline";
      case "checked-in":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử & Lịch hẹn</CardTitle>
      </CardHeader>
      <CardContent>
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
            {appointments.length > 0 ? (
              appointments.map((app) => {
                const service = services.find((s) => s.id === app.serviceId);
                const technician = staff.find((t) => t.id === app.technicianId);
                return (
                  <TableRow key={app.id}>
                    <TableCell>
                      {new Date(app.date).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {service?.name || "N/A"}
                    </TableCell>
                    <TableCell>{technician?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(app.status)}>
                        {app.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Không có lịch hẹn nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
