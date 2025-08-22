"use client";

import React from "react";
import { StatisticsSidebar } from "@/features/appointment-management/StatisticsSidebar";
import { AppointmentTimeline } from "@/features/appointment-management/AppointmentTimeline";
import { AppointmentDetails } from "@/features/appointment-management/AppointmentDetails";

export default function AppointmentsManagementPage() {
  return (
    <div className="flex h-full">
      <StatisticsSidebar />
      <AppointmentTimeline />
      <AppointmentDetails />
    </div>
  );
}
