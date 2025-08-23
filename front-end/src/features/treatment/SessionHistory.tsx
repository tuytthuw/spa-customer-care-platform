import { TreatmentSession } from "@/types/treatment";
import { mockStaff } from "@/lib/mock-data";
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
}

const SessionHistory = ({ sessions }: SessionHistoryProps) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">Lịch sử liệu trình</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Buổi</TableHead>
            <TableHead>Ngày thực hiện</TableHead>
            <TableHead>Kỹ thuật viên</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session, index) => {
            const technician = mockStaff.find(
              (s) => s.id === session.technicianId
            );
            return (
              <TableRow key={session.id}>
                <TableCell>Buổi {index + 1}</TableCell>
                <TableCell>
                  {new Date(session.date).toLocaleDateString("vi-VN")}
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionHistory;
