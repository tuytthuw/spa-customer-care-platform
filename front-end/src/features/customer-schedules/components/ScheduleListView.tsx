// src/features/schedule/components/ScheduleListView.tsx
"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PurchasedItemCard from "@/features/my-packages/components/PurchasedItemCard";
import AppointmentCard from "@/features/appointment/components/my-appointments/AppointmentCard";
import { ScheduleDataProps, ActionableItem } from "../types";

export default function ScheduleListView({
  appointments,
  treatments,
  services,
  treatmentPlans,
  staff,
  reviews,
  currentUserProfile,
}: ScheduleDataProps) {
  // Logic phân loại dữ liệu sử dụng useMemo để tối ưu hiệu suất
  const { actionableItems, upcomingAppointments, historyItems } =
    useMemo(() => {
      const customerAppointments = appointments.filter(
        (a) => a.customerId === currentUserProfile.id
      );
      const customerTreatments = treatments.filter(
        (t) => t.customerId === currentUserProfile.id
      );

      // 1. Tab "Cần thực hiện"
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

      // 2. Tab "Sắp tới"
      const upcoming = customerAppointments
        .filter(
          (a) =>
            new Date(a.date) >= new Date() &&
            (a.status === "upcoming" || a.status === "checked-in")
        )
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      // 3. Tab "Lịch sử"
      const history = customerAppointments
        .filter(
          (a) =>
            new Date(a.date) < new Date() ||
            a.status === "completed" ||
            a.status === "cancelled"
        )
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
          Cần thực hiện ({actionableItems.length})
        </TabsTrigger>
        <TabsTrigger value="upcoming">
          Sắp tới ({upcomingAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="history">
          Lịch sử ({historyItems.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="actions" className="mt-4">
        <div className="space-y-6">
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
            <p className="text-muted-foreground p-4 text-center">
              Tuyệt vời! Bạn không có mục nào cần thực hiện.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="upcoming" className="mt-4">
        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((app) => {
              const service = services.find((s) => s.id === app.serviceId);
              const technician = staff.find((t) => t.id === app.technicianId);
              if (!service) return null;
              // Chức năng hủy và review sẽ được tích hợp sau
              return (
                <AppointmentCard
                  key={app.id}
                  appointment={app}
                  service={service}
                  technician={technician}
                  onCancel={() => {}}
                  onReview={() => {}}
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
                  onCancel={() => {}}
                  onReview={() => {}}
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
