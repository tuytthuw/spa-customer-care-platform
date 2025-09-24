"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/components/ui/alert-dialog";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { Label } from "@/features/shared/components/ui/label";

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const CancelAppointmentModal = ({
  isOpen,
  onClose,
  onConfirm,
}: CancelAppointmentModalProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc chắn muốn hủy lịch hẹn?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Lịch hẹn sau khi hủy không thể khôi phục. Vui lòng đọc kỹ chính sách
            hủy lịch của chúng tôi trước khi xác nhận.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reason">Lý do hủy (không bắt buộc)</Label>
          <Textarea
            id="reason"
            placeholder="Nhập lý do của bạn..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
          <p>
            <strong>Chính sách hủy lịch:</strong> Hủy lịch trước 24 giờ sẽ được
            hoàn lại toàn bộ chi phí. Hủy lịch trong vòng 24 giờ sẽ không được
            hoàn lại.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Không</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Xác nhận hủy
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelAppointmentModal;
