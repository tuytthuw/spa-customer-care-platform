import { TreatmentSession } from "@/features/treatment/types";
import { Staff } from "@/features/staff/types";
import { Service } from "@/features/service/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SessionHistoryProps {
  sessions: TreatmentSession[];
  staffList: Staff[];
  serviceList: Service[];
  treatmentPackageId: string;
}

export default function SessionHistory({
  sessions,
  staffList,
  serviceList,
  treatmentPackageId,
}: SessionHistoryProps) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">Lịch sử các buổi</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Buổi</TableHead>
            <TableHead>Dịch vụ</TableHead>
            <TableHead>Ngày thực hiện</TableHead>
            <TableHead>Kỹ thuật viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>{" "}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => {
            const technician = staffList.find(
              (s) => s.id === session.technicianId
            );
            const service = serviceList.find((s) => s.id === session.serviceId);

            return (
              <TableRow key={session.id}>
                <TableCell>Buổi {session.treatmentPlanStep}</TableCell>
                <TableCell className="font-medium">
                  {service?.name || "N/A"}
                </TableCell>
                <TableCell>
                  {session.date
                    ? new Date(session.date).toLocaleDateString("vi-VN")
                    : "Chưa đặt lịch"}
                </TableCell>
                <TableCell>{technician?.name || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      session.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {session.status === "completed" ? "Hoàn thành" : "Sắp tới"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {session.status === "upcoming" && !session.date && (
                    <Button asChild size="sm">
                      <Link
                        href={`/booking?treatmentPackageId=${treatmentPackageId}&sessionId=${session.id}&serviceId=${session.serviceId}`}
                      >
                        Đặt lịch
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
