import { TreatmentSession } from "@/types/treatment";
import { Staff } from "@/types/staff";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SessionHistoryProps {
  sessions: TreatmentSession[];
  staffList: Staff[];
}

export default function SessionHistory({
  sessions,
  staffList,
}: SessionHistoryProps) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">Lịch sử các buổi</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Buổi</TableHead>
            <TableHead>Ngày thực hiện</TableHead>
            <TableHead>Kỹ thuật viên</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session, index) => {
            const technician = staffList.find(
              (s) => s.id === session.technicianId
            );
            return (
              <TableRow key={session.id}>
                <TableCell>Buổi {index + 1}</TableCell>
                <TableCell>
                  {new Date(session.date).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>{technician?.name || "N/A"}</TableCell>
                <TableCell className="text-sm italic text-muted-foreground">
                  {session.notes || "Không có"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      session.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {session.status === "completed" ? "Hoàn thành" : "Sắp tới"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
