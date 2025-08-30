"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Appointment } from "@/features/appointment/types";

interface LogStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onSave: (appointmentId: string, notes: string) => void;
}

const LogStatusModal = ({
  isOpen,
  onClose,
  appointment,
  onSave,
}: LogStatusModalProps) => {
  const [notes, setNotes] = useState(appointment.technicianNotes || "");

  const handleSave = () => {
    onSave(appointment.id, notes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ghi nhận tình trạng dịch vụ</DialogTitle>
          <DialogDescription>
            Thêm ghi chú chuyên môn cho lịch hẹn này. Ghi chú sẽ được lưu vào hồ
            sơ của khách hàng.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="technician-notes">Ghi chú của kỹ thuật viên</Label>
          <Textarea
            id="technician-notes"
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ví dụ: Da khách hàng có cải thiện, vùng má giảm mụn, cần cấp ẩm thêm..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu và Hoàn thành</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogStatusModal;
