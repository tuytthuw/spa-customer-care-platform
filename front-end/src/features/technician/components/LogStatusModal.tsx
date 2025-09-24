"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormDialog } from "@/features/shared/components/common/FormDialog";
import LogStatusFormFields from "./LogStatusFormFields";
import { Appointment } from "@/features/appointment/types";

const logStatusSchema = z.object({
  notes: z.string().optional(),
});

type LogStatusFormValues = z.infer<typeof logStatusSchema>;

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
  const form = useForm<LogStatusFormValues>({
    resolver: zodResolver(logStatusSchema),
    defaultValues: {
      notes: appointment.technicianNotes || "",
    },
  });

  const handleSubmit = (data: LogStatusFormValues) => {
    onSave(appointment.id, data.notes || "");
  };

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Ghi nhận tình trạng dịch vụ"
      description="Thêm ghi chú chuyên môn cho lịch hẹn này. Ghi chú sẽ được lưu vào hồ sơ của khách hàng."
      form={form}
      onFormSubmit={handleSubmit}
      submitText="Lưu và Hoàn thành"
    >
      <LogStatusFormFields />
    </FormDialog>
  );
};

export default LogStatusModal;
