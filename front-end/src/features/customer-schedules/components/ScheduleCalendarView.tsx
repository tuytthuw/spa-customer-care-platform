// src/features/customer-schedules/components/ScheduleCalendarView.tsx
"use client";

import { useState } from "react";
import { Appointment } from "@/features/appointment/types";
import InteractiveCalendar from "./InteractiveCalendar";
import AppointmentCard from "./AppointmentCard"; // ✅ THAY ĐỔI: Import AppointmentCard
import { ScheduleDataProps } from "@/features/customer-schedules/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/features/shared/components/ui/dialog";

import ActionRequiredList from "./ActionRequiredList";
import { ScrollArea } from "@/features/shared/components/ui/scroll-area";

interface ScheduleCalendarViewProps extends ScheduleDataProps {
  onCancelAppointment: (id: string, reason: string) => void;
  onWriteReview: (appointment: Appointment) => void;
  onCreateAppointment: (date: Date) => void;
}

export default function ScheduleCalendarView(props: ScheduleCalendarViewProps) {
  const {
    appointments,
    services,
    staff,
    reviews,
    onCancelAppointment,
    onWriteReview,
    treatments,
    treatmentPlans,
    onCreateAppointment,
  } = props;
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Lấy thông tin chi tiết cho lịch hẹn được chọn
  const selectedService = services.find(
    (s) => s.id === selectedAppointment?.serviceId
  );
  const selectedTechnician = staff.find(
    (t) => t.id === selectedAppointment?.technicianId
  );
  const hasReviewed = selectedAppointment
    ? reviews.some((r) => r.appointmentId === selectedAppointment.id)
    : false;
  const treatmentPackage = selectedAppointment?.treatmentPackageId
    ? treatments.find(
        (pkg) => pkg.id === selectedAppointment.treatmentPackageId
      )
    : undefined;
  const treatmentPlan = treatmentPackage
    ? treatmentPlans.find(
        (plan) => plan.id === treatmentPackage.treatmentPlanId
      )
    : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full flex-grow">
      <div className=" lg:block bg-card p-4 rounded-lg border flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Đã mua - Cần đặt lịch</h3>
        <ActionRequiredList {...props} />
      </div>

      <div className="h-full flex flex-col">
        <div className="flex-grow">
          <InteractiveCalendar
            appointments={appointments}
            services={services}
            onSelectAppointment={setSelectedAppointment}
            onCreateAppointment={onCreateAppointment}
          />
        </div>
      </div>

      <Dialog
        open={!!selectedAppointment}
        onOpenChange={(isOpen) => !isOpen && setSelectedAppointment(null)}
      >
        <DialogContent className="w-[95vw] max-w-[420px] sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedAppointment && selectedService && (
              <AppointmentCard
                appointment={selectedAppointment}
                service={selectedService}
                technician={selectedTechnician}
                treatmentPackage={treatmentPackage}
                treatmentPlan={treatmentPlan}
                onCancel={(id) => onCancelAppointment(id, "Cancelled by user")}
                onReview={onWriteReview}
                hasReviewed={hasReviewed}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
