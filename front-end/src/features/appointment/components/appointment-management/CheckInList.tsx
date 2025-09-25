"use client";

import { useState } from "react";
import { Appointment } from "@/features/appointment/types";
import { FullCustomerProfile } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Checkbox } from "@/features/shared/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/shared/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/avatar";
import { toast } from "sonner";

interface CheckInListProps {
  appointments: Appointment[];
  customers: FullCustomerProfile[];
  services: Service[];
  onBulkCheckIn: (appointmentIds: string[]) => void;
  isSubmitting: boolean;
}

export default function CheckInList({
  appointments,
  customers,
  services,
  onBulkCheckIn,
  isSubmitting,
}: CheckInListProps) {
  const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<
    string[]
  >([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppointmentIds(appointments.map((app) => app.id));
    } else {
      setSelectedAppointmentIds([]);
    }
  };

  const handleSelectOne = (appointmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAppointmentIds((prev) => [...prev, appointmentId]);
    } else {
      setSelectedAppointmentIds((prev) =>
        prev.filter((id) => id !== appointmentId)
      );
    }
  };

  const handleSubmit = () => {
    if (selectedAppointmentIds.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một lịch hẹn để check-in.");
      return;
    }
    onBulkCheckIn(selectedAppointmentIds);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedAppointmentIds.length === appointments.length &&
                      appointments.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Giờ hẹn</TableHead>
                <TableHead>Dịch vụ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((app) => {
                  const customer = customers.find(
                    (c) => c.id === app.customerId
                  );
                  const service = services.find((s) => s.id === app.serviceId);
                  if (!customer || !service) return null;

                  return (
                    <TableRow key={app.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAppointmentIds.includes(app.id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(app.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={customer.avatar}
                              alt={customer.name}
                            />
                            <AvatarFallback>{customer.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(app.date).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>{service.name}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Không có lịch hẹn nào cần check-in hôm nay.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {appointments.length > 0 && (
          <div className="p-4 border-t flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedAppointmentIds.length === 0}
            >
              {isSubmitting
                ? "Đang xử lý..."
                : `Check-in (${selectedAppointmentIds.length}) lịch hẹn đã chọn`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
