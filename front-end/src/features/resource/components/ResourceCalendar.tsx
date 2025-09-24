"use client";

import { Resource } from "@/features/resource/types";
import { Appointment } from "@/features/appointment/types";
import { FullCustomerProfile } from "@/features/customer/types";
import { Staff } from "@/features/staff/types";
import { FullCalendarUI } from "@/features/shared/components/ui/full-calendar";

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

  const groupedResources = [
    {
      id: "staff",
      title: "Kỹ Thuật Viên",
      children: staff
        .filter((s) => s.role === "technician")
        .map((technician) => ({
          id: technician.id,
          title: technician.name,
        })),
    },
    {
      id: "rooms",
      title: "Phòng & Giường",
      children: resources
        .filter((r) => r.type === "room")
        .map((resource) => ({
          id: resource.id,
          title: resource.name,
        })),
    },
    {
      id: "equipments",
      title: "Thiết Bị",
      children: resources
        .filter((r) => r.type === "equipment")
        .map((resource) => ({
          id: resource.id,
          title: resource.name,
        })),
    },
  ];

  const calendarEvents = appointments.map((app) => {
    const customer = customers.find((c) => c.id === app.customerId);

    // ✅ SỬA LỖI: Lọc bỏ các giá trị undefined để đảm bảo mảng chỉ chứa string
    const resourceIds = [app.technicianId, app.resourceId].filter(
      Boolean
    ) as string[];

    return {
      id: app.id,
      resourceIds: resourceIds,
      title: customer ? customer.name : "Khách lẻ",
      start: new Date(app.date),
      end: new Date(new Date(app.date).getTime() + 60 * 60 * 1000),
    };
  });

  return (
    <FullCalendarUI
      initialView="resourceTimelineDay"
      resources={groupedResources}
      events={calendarEvents}
      resourceAreaHeaderContent="Danh sách"
    />
  );
}
