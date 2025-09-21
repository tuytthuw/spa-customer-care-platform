"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/features/customer-schedules/components/AppointmentCard";
import { ScheduleDataProps, ActionableItem } from "../types";
import { Appointment } from "@/features/appointment/types";
import ActionRequiredList from "./ActionRequiredList";

interface ScheduleListViewProps extends ScheduleDataProps {
  onCancelAppointment: (id: string, reason: string) => void;
  onWriteReview: (appointment: Appointment) => void;
}

export default function ScheduleListView(props: ScheduleListViewProps) {
  const {
    appointments,
    treatments,
    currentUserProfile,
    treatmentPlans,
    services,
    staff,
    reviews,
    onCancelAppointment,
    onWriteReview,
  } = props;

  const { actionableItems, upcomingAppointments, historyItems } =
    useMemo(() => {
      const customerAppointments = appointments.filter(
        (a) => a.customerId === currentUserProfile.id
      );
      const customerTreatments = treatments.filter(
        (t) => t.customerId === currentUserProfile.id
      );

      const actions: ActionableItem[] = [];
      (currentUserProfile.purchasedServices || []).forEach((ps) => {
        if (ps.quantity > 0) {
          actions.push({ type: "service", data: ps });
        }
      });
      customerTreatments.forEach((pkg) => {
        const plan = treatmentPlans.find((p) => p.id === pkg.treatmentPlanId);
        if (plan && pkg.completedSessions < plan.totalSessions) {
          const hasUpcomingSessionForPackage = customerAppointments.some(
            (app) =>
              app.treatmentPackageId === pkg.id &&
              app.status === "upcoming" &&
              new Date(app.date) > new Date()
          );
          if (!hasUpcomingSessionForPackage) {
            actions.push({ type: "treatment", data: pkg });
          }
        }
      });

      const upcoming = customerAppointments
        .filter(
          (a) =>
            new Date(a.date) >= new Date() &&
            (a.status === "upcoming" || a.status === "checked-in")
        )
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      const upcomingAppointmentIds = new Set(upcoming.map((app) => app.id));

      const history = customerAppointments
        .filter((a) => !upcomingAppointmentIds.has(a.id))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      return {
        actionableItems: actions,
        upcomingAppointments: upcoming,
        historyItems: history,
      };
    }, [appointments, treatments, currentUserProfile, treatmentPlans]);

  return (
    <Tabs defaultValue="actions">
      <TabsList className="grid w-full grid-cols-3 md:w-auto md:max-w-[500px] h-auto">
        <TabsTrigger value="actions">
          Đã mua ({actionableItems.length})
        </TabsTrigger>
        <TabsTrigger value="upcoming">
          Sắp tới ({upcomingAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="history">
          Lịch sử ({historyItems.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="actions" className="mt-4">
        <ActionRequiredList {...props} />
      </TabsContent>

      <TabsContent value="upcoming" className="mt-4">
        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((app) => {
              const service = services.find((s) => s.id === app.serviceId);
              const technician = staff.find((t) => t.id === app.technicianId);
              if (!service) return null;

              return (
                <AppointmentCard
                  key={app.id}
                  appointment={app}
                  service={service}
                  technician={technician}
                  onCancel={onCancelAppointment}
                  onReview={onWriteReview}
                  hasReviewed={false}
                />
              );
            })
          ) : (
            <p className="text-muted-foreground p-4 text-center">
              Bạn không có lịch hẹn nào sắp tới.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="history" className="mt-4">
        <div className="space-y-4">
          {historyItems.length > 0 ? (
            historyItems.map((app) => {
              const service = services.find((s) => s.id === app.serviceId);
              const technician = staff.find((t) => t.id === app.technicianId);
              const hasReviewed = reviews.some(
                (r) => r.appointmentId === app.id
              );
              if (!service) return null;
              return (
                <AppointmentCard
                  key={app.id}
                  appointment={app}
                  service={service}
                  technician={technician}
                  onCancel={onCancelAppointment}
                  onReview={onWriteReview}
                  hasReviewed={hasReviewed}
                />
              );
            })
          ) : (
            <p className="text-muted-foreground p-4 text-center">
              Lịch sử lịch hẹn của bạn trống.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
