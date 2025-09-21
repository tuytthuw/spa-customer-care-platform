// src/features/customer-schedules/components/ScheduleCalendarView.tsx
"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Appointment } from "@/features/appointment/types";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import các component con
import InteractiveCalendar from "./InteractiveCalendar";
import AppointmentDetailPanel from "./AppointmentDetailPanel";
import {
  ScheduleDataProps,
  ActionableItem,
} from "@/features/customer-schedules/types";
import PurchasedItemCard from "@/features/my-packages/components/PurchasedItemCard";

interface ScheduleCalendarViewProps extends ScheduleDataProps {
  onCancelAppointment: (id: string, reason: string) => void;
  onWriteReview: (appointment: Appointment) => void;
}

export default function ScheduleCalendarView(props: ScheduleCalendarViewProps) {
  const {
    appointments,
    treatments,
    services,
    treatmentPlans,
    staff,
    currentUserProfile,
    reviews,
    onCancelAppointment,
    onWriteReview,
  } = props;
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const actionableItems = useMemo(() => {
    const actions: ActionableItem[] = [];
    const customerAppointments = appointments.filter(
      (a) => a.customerId === currentUserProfile.id
    );
    const customerTreatments = treatments.filter(
      (t) => t.customerId === currentUserProfile.id
    );

    (currentUserProfile.purchasedServices || []).forEach((ps) => {
      if (ps.quantity > 0) {
        actions.push({ type: "service", data: ps });
      }
    });

    customerTreatments.forEach((pkg) => {
      const plan = treatmentPlans.find((p) => p.id === pkg.treatmentPlanId);
      if (plan && pkg.completedSessions < plan.totalSessions) {
        const hasUpcomingSession = customerAppointments.some(
          (app) =>
            app.treatmentPackageId === pkg.id && app.status === "upcoming"
        );
        if (!hasUpcomingSession) {
          actions.push({ type: "treatment", data: pkg });
        }
      }
    });

    return actions;
  }, [appointments, treatments, currentUserProfile, treatmentPlans]);
  return (
    <div className="grid xl:grid-cols-[320px_1fr_auto] gap-6 h-full flex-grow">
      {/* --- Cột 1: Cần đặt lịch --- */}
      <div className="hidden xl:block bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Cần đặt lịch</h3>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4 pr-4">
            {actionableItems.length > 0 ? (
              actionableItems.map((item, index) => {
                if (item.type === "treatment") {
                  const pkg = item.data;
                  const planInfo = treatmentPlans.find(
                    (p) => p.id === pkg.treatmentPlanId
                  );
                  return (
                    <PurchasedItemCard
                      key={`treat-${pkg.id}-${index}`}
                      item={{ type: "treatment", data: pkg, details: planInfo }}
                      staffList={staff}
                      serviceList={services}
                      isCompleted={false}
                      hasReviewed={false}
                      onWriteReview={() => {}}
                    />
                  );
                }
                if (item.type === "service") {
                  const purchased = item.data;
                  const serviceInfo = services.find(
                    (s) => s.id === purchased.serviceId
                  );
                  return (
                    <PurchasedItemCard
                      key={`serv-${purchased.serviceId}-${index}`}
                      item={{
                        type: "service",
                        data: purchased,
                        details: serviceInfo,
                      }}
                      staffList={staff}
                      serviceList={services}
                      isCompleted={false}
                      hasReviewed={false}
                      onWriteReview={() => {}}
                    />
                  );
                }
                return null;
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center p-4">
                Không có mục nào cần thực hiện.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* --- Cột 2: Lịch trình --- */}
      <div className="h-full flex flex-col">
        <div className="flex-grow">
          <InteractiveCalendar
            {...props}
            onSelectAppointment={setSelectedAppointment}
          />
        </div>
      </div>

      {/* --- Cột 3: Chi tiết (Hiện/ẩn) --- */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          selectedAppointment ? "w-full max-w-[400px] hidden xl:block" : "w-0"
        )}
      >
        {selectedAppointment && (
          <AppointmentDetailPanel
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            services={services}
            staff={staff}
            reviews={reviews}
            onCancelAppointment={onCancelAppointment}
            onWriteReview={onWriteReview}
          />
        )}
      </div>
    </div>
  );
}
