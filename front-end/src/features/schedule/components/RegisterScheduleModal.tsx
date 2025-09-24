"use client";

import { useForm } from "react-hook-form";
import { ScheduleRegistrationData } from "@/features/schedule/types";
import { FormDialog } from "@/features/shared/components/common/FormDialog";
import RegisterScheduleFormFields from "./RegisterScheduleFormFields";

interface RegisterScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: ScheduleRegistrationData) => void;
}

export const RegisterScheduleModal = ({
  isOpen,
  onClose,
  onSave,
}: RegisterScheduleModalProps) => {
  const form = useForm<ScheduleRegistrationData>();

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng ký lịch làm việc tuần tới"
      description="Chọn ca làm việc mong muốn cho từng ngày. Yêu cầu sẽ được gửi đến quản lý để phê duyệt."
      form={form}
      onFormSubmit={onSave}
      submitText="Gửi đăng ký"
    >
      <RegisterScheduleFormFields />
    </FormDialog>
  );
};
