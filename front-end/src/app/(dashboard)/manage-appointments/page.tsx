"use client";

import { useState } from "react";
import { StatisticsSidebar } from "@/features/appointment-management/StatisticsSidebar";
import { AppointmentTimeline } from "@/features/appointment-management/AppointmentTimeline";
import { AppointmentDetails } from "@/features/appointment-management/AppointmentDetails";
import { mockAppointments as initialAppointments } from "@/lib/mock-data";
import { Appointment, AppointmentStatus } from "@/types/appointment";

export default function AppointmentsManagementPage() {
  // --- Quản lý state tập trung tại đây ---
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(initialAppointments[0] || null);

  // --- Hàm xử lý cập nhật trạng thái ---
  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    console.log(`Updating appointment ${id} to ${newStatus}`);
    setAppointments((currentApps) =>
      currentApps.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    // Cập nhật cả lịch hẹn đang được chọn nếu nó trùng khớp
    if (selectedAppointment?.id === id) {
      setSelectedAppointment((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  // --- Hàm chọn lịch hẹn để xem chi tiết ---
  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };
  return (
    <div className="flex h-full">
      {/* Truyền dữ liệu và hàm xử lý xuống các component con */}
      <StatisticsSidebar appointments={appointments} />
      <AppointmentTimeline
        appointments={appointments}
        onSelectAppointment={handleSelectAppointment}
        onStatusChange={handleStatusChange}
        selectedAppointmentId={selectedAppointment?.id}
      />
      <AppointmentDetails
        appointment={selectedAppointment}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
