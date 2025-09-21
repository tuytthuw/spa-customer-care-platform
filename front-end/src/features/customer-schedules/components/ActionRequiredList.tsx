// src/features/customer-schedules/components/ActionRequiredList.tsx
"use client";

import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
// Import các types cần thiết
import {
  ActionableItem,
  ScheduleDataProps,
} from "@/features/customer-schedules/types";
import PurchasedItemCard from "./PurchasedItemCard"; // Sử dụng lại component card đã có

export default function ActionRequiredList(props: ScheduleDataProps) {
  const {
    appointments,
    treatments,
    services,
    treatmentPlans,
    staff,
    currentUserProfile,
  } = props;

  const actionableItems = useMemo(() => {
    const actions: ActionableItem[] = [];
    const customerAppointments = appointments.filter(
      (a) => a.customerId === currentUserProfile.id
    );
    const customerTreatments = treatments.filter(
      (t) => t.customerId === currentUserProfile.id
    );

    // Lọc các dịch vụ lẻ đã mua còn lượt
    (currentUserProfile.purchasedServices || []).forEach((ps) => {
      if (ps.quantity > 0) {
        actions.push({ type: "service", data: ps });
      }
    });

    // Lọc các liệu trình còn buổi và chưa có lịch hẹn sắp tới
    customerTreatments.forEach((pkg) => {
      const plan = treatmentPlans.find((p) => p.id === pkg.treatmentPlanId);
      if (plan && pkg.completedSessions < plan.totalSessions) {
        const hasUpcomingSessionForPackage = customerAppointments.some(
          (app) =>
            app.treatmentPackageId === pkg.id && app.status === "upcoming"
        );
        if (!hasUpcomingSessionForPackage) {
          actions.push({ type: "treatment", data: pkg });
        }
      }
    });

    return actions;
  }, [appointments, treatments, currentUserProfile, treatmentPlans]);

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
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
            Bạn không có mục nào cần thực hiện.
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
