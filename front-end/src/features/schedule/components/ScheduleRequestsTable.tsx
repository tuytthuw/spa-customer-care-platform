"use client";

import { useState } from "react";
import { WorkSchedule } from "@/features/schedule/types";
import { mockStaff } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Check, X } from "lucide-react";

interface ScheduleRequestsTableProps {
  requests: WorkSchedule[];
  onUpdateRequest: (
    staffId: string,
    weekOf: string,
    newStatus: "approved" | "rejected"
  ) => void;
}

export const ScheduleRequestsTable = ({
  requests,
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
              const staff = mockStaff.find((s) => s.id === request.staffId);
              if (!staff || !request.weekOf) return null;

              return (
                <TableRow key={`${request.staffId}-${request.weekOf}`}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
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
                              staff!.id,
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
                              staff!.id,
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
