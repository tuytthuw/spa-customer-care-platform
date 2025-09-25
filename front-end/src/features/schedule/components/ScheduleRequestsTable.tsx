"use client";

import { useState } from "react";
import { WorkSchedule } from "@/features/schedule/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Button } from "@/features/shared/components/ui/button";
import { Check, X } from "lucide-react";
import { Staff } from "@/features/staff/types"; // SỬA 1: Import Staff type

interface ScheduleRequestsTableProps {
  requests: WorkSchedule[];
  staff: Staff[]; // SỬA 2: Thêm staff vào props
  onUpdateRequest: (
    staffId: string,
    weekOf: string,
    newStatus: "approved" | "rejected"
  ) => void;
}

export const ScheduleRequestsTable = ({
  requests,
  staff, // SỬA 3: Nhận staff từ props
  onUpdateRequest,
}: ScheduleRequestsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yêu cầu đăng ký lịch</CardTitle>
        <CardDescription>
          Duyệt các yêu cầu đăng ký lịch làm việc mới từ nhân viên.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Tuần Đăng ký</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              // SỬA 4: Sử dụng `staff` từ props thay vì `mockStaff`
              const staffMember = staff.find(
                (s: Staff) => s.id === request.staffId
              );
              if (!staffMember || !request.weekOf) return null;

              return (
                <TableRow key={`${request.staffId}-${request.weekOf}`}>
                  <TableCell className="font-medium">
                    {staffMember.name}
                  </TableCell>
                  <TableCell>{`Tuần từ ${new Date(
                    request.weekOf
                  ).toLocaleDateString("vi-VN")}`}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "pending" ? "default" : "secondary"
                      }
                    >
                      {request.status === "pending" && "Đang chờ"}
                      {request.status === "approved" && "Đã duyệt"}
                      {request.status === "rejected" && "Đã từ chối"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {request.status === "pending" && (
                      <>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-green-600"
                          onClick={() =>
                            onUpdateRequest(
                              staffMember!.id,
                              request.weekOf!,
                              "approved"
                            )
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() =>
                            onUpdateRequest(
                              staffMember!.id,
                              request.weekOf!,
                              "rejected"
                            )
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
