"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  extendedProps: { [key: string]: any };
}

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedEvent: CalendarEvent | null;
  notes: string;
  setNotes: (notes: string) => void;
  onComplete: () => void;
}

export const AppointmentDetailsModal = ({
  isOpen,
  onOpenChange,
  selectedEvent,
  notes,
  setNotes,
  onComplete,
}: AppointmentDetailsModalProps) => {
  if (!selectedEvent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedEvent.extendedProps.serviceName}</DialogTitle>
          <DialogDescription>Chi tiết lịch hẹn</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Khách hàng</Label>
            <p className="font-medium">
              {selectedEvent.extendedProps.customerName}
            </p>
          </div>
          <div>
            <Label>Thời gian</Label>
            <p className="font-medium">
              {new Date(selectedEvent.start).toLocaleString("vi-VN", {
                timeStyle: "short",
              })}
            </p>
          </div>
          <div>
            <Label htmlFor="notes">Ghi chú sau dịch vụ</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú về tình trạng da, sản phẩm đã dùng..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="mt-6 sm:justify-between">
          <Button variant="outline" asChild>
            <Link href={`/customers/${selectedEvent.extendedProps.customerId}`}>
              Xem hồ sơ khách hàng
            </Link>
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="ghost">Đóng</Button>
            </DialogClose>
            <Button onClick={onComplete}>Hoàn thành dịch vụ</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
