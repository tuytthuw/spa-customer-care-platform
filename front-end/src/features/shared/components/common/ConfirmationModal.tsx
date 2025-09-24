// src/components/common/ConfirmationModal.tsx

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/features/shared/components/ui/alert-dialog";
import { Button } from "@/features/shared/components/ui/button";
import React from "react";

interface ConfirmationModalProps {
  trigger: React.ReactNode; // Component sẽ kích hoạt modal (thường là Button hoặc DropdownMenuItem)
  title: string;
  description: React.ReactNode; // Cho phép truyền cả text hoặc component
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean; // Nếu hành động là xóa/hủy
}

export const ConfirmationModal = ({
  trigger,
  title,
  description,
  onConfirm,
  confirmText = "Tiếp tục",
  cancelText = "Hủy",
  isDestructive = false,
}: ConfirmationModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              isDestructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
