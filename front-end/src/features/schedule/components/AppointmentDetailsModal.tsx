"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import { Appointment } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { User, NotebookPen } from "lucide-react";
import CustomerProfileModal from "../../technician/components/CustomerProfileModal";
import LogStatusModal from "../../technician/components/LogStatusModal";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  customer: Customer | null;
  service: Service | null;
  onUpdateAppointment: (id: string, notes: string, status: "completed") => void;
}

export const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
  customer,
  service,
  onUpdateAppointment,
}: AppointmentDetailsModalProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  if (!appointment || !service || !customer) return null;

  const handleSaveLog = (appointmentId: string, notes: string) => {
    onUpdateAppointment(appointmentId, notes, "completed");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{service.name}</DialogTitle>
            <DialogDescription>
              Lịch hẹn vào lúc ngày{" "}
              {new Date(appointment.date).toLocaleDateString("vi-VN")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <strong>Khách hàng:</strong> {customer.name}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span className="capitalize">
                {appointment.status.replace("-", " ")}
              </span>
            </p>
          </div>
          <DialogFooter className="flex-wrap justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <User className="mr-2 h-4 w-4" />
              Xem hồ sơ
            </Button>
            {/* Nút Ghi nhận & Hoàn thành */}
            {appointment.status === "in-progress" && (
              <Button onClick={() => setIsLogModalOpen(true)}>
                <NotebookPen className="mr-2 h-4 w-4" />
                Ghi nhận & Hoàn thành
              </Button>
            )}
            <Button onClick={onClose} className="ml-auto">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Các modal con */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        customerId={customer.id || null}
      />
      <LogStatusModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        appointment={appointment}
        onSave={handleSaveLog}
      />
    </>
  );
};
