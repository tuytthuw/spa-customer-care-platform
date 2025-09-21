// src/features/customer-schedules/components/ScheduleCalendarView.tsx
"use client";

import { useState } from "react";
import { Appointment } from "@/features/appointment/types";
import InteractiveCalendar from "./InteractiveCalendar";
import AppointmentCard from "./AppointmentCard"; // ✅ THAY ĐỔI: Import AppointmentCard
import { ScheduleDataProps } from "@/features/customer-schedules/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen } from "lucide-react";
import ActionRequiredList from "./ActionRequiredList";

interface ScheduleCalendarViewProps extends ScheduleDataProps {
  onCancelAppointment: (id: string, reason: string) => void;
  onWriteReview: (appointment: Appointment) => void;
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
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <PanelLeftOpen className="mr-2 h-4 w-4" />
                Xem các mục đã mua
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[350px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Đã mua</SheetTitle>
              </SheetHeader>
              <ActionRequiredList {...props} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex-grow">
          <InteractiveCalendar
            appointments={appointments}
            services={services}
            onSelectAppointment={setSelectedAppointment}
          />
        </div>
      </div>

      {/* --- Dialog chi tiết cho màn hình nhỏ (hiện dưới xl) --- */}
      <div className="xl:hidden">
        <Dialog
          open={!!selectedAppointment}
          onOpenChange={(isOpen) => !isOpen && setSelectedAppointment(null)}
        >
          <DialogContent className="w-[95vw] max-w-[420px] sm:max-w-[540px]">
            <DialogHeader>
              <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
            </DialogHeader>
            {selectedAppointment && selectedService && (
              // ✅ THAY ĐỔI: Sử dụng AppointmentCard ở đây
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
