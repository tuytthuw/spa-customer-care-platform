"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Invoice } from "@/features/billing/types";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: "cash" | "card" | "transfer") => void;
  totalAmount: number;
  isSubmitting: boolean;
}

export default function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  isSubmitting,
}: PaymentConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận thanh toán</DialogTitle>
          <DialogDescription>
            Chọn phương thức thanh toán để hoàn tất hóa đơn này.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-muted-foreground">Tổng số tiền cần thanh toán</p>
          <p className="text-4xl font-bold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalAmount)}
          </p>
        </div>
        <DialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button onClick={() => onConfirm("cash")} disabled={isSubmitting}>
            Tiền mặt
          </Button>
          <Button onClick={() => onConfirm("card")} disabled={isSubmitting}>
            Thẻ
          </Button>
          <Button onClick={() => onConfirm("transfer")} disabled={isSubmitting}>
            Chuyển khoản
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
