"use client";

import { Resource } from "@/features/resource/types";
import { Appointment } from "@/features/appointment/types";
import { FullCustomerProfile } from "@/features/customer/api/customer.api";
import { Staff } from "@/features/staff/types";
import { FullCalendarUI } from "@/components/ui/full-calendar";

interface ResourceCalendarProps {
  resources: Resource[];
  appointments: Appointment[];
  customers: FullCustomerProfile[];
  staff: Staff[];
}

export default function ResourceCalendar({
  resources,
  appointments,
  customers,
  staff,
}: ResourceCalendarProps) {
  // --- Chuẩn bị dữ liệu cho FullCalendar ---
  const techniciansAsResources = staff
    .filter((s) => s.role === "technician")
    .map((technician) => ({
      id: technician.id,
      title: technician.name,
    }));

  const physicalResources = resources.map((resource) => ({
    id: resource.id,
    title: resource.name,
  }));

  const allCalendarResources = [
    ...techniciansAsResources,
    ...physicalResources,
  ];

  const calendarEvents = appointments.map((app) => {
    const customer = customers.find((c) => c.id === app.customerId);

    let eventClassName = "fc-event-default";
    const technician = staff.find((s) => s.id === app.technicianId);
    if (technician) {
      eventClassName = "fc-event-technician";
    }

    return {
      id: app.id,
      resourceId: app.technicianId,
      title: customer ? customer.name : "Khách lẻ",
      start: new Date(app.date),
      end: new Date(new Date(app.date).getTime() + 60 * 60 * 1000),
      className: eventClassName,
    };
  });

  // --- Hiển thị ---
  return (
    <FullCalendarUI resources={allCalendarResources} events={calendarEvents} />
  );
}
