"use client";

import { useMemo } from "react";
import { useAuth } from "@/providers/auth-context";
import { useAppointments } from "@/features/appointments/store";
import { hhmm, isTodayIso } from "@/lib/dt";
import type { Appointment } from "@/features/appointments/types";

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const all = useAppointments((s) => s.items); // ✅ lấy snapshot thô
  const uid = user?.id ?? "";

  const items = useMemo(
    () => all.filter((a) => a.customerId === uid), // ✅ derive trong useMemo
    [all, uid]
  );

  const renderRow = (a: Appointment) => (
    <tr key={a.id} className="border-b">
      <td className="px-3 py-2">
        {isTodayIso(a.start)
          ? "Hôm nay"
          : new Date(a.start).toLocaleDateString()}
      </td>
      <td className="px-3 py-2">
        {hhmm(a.start)}–{hhmm(a.end)}
      </td>
      <td className="px-3 py-2">{a.serviceName}</td>
      <td className="px-3 py-2">{a.status}</td>
    </tr>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Lịch của tôi</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-3 py-2">Ngày</th>
            <th className="px-3 py-2">Giờ</th>
            <th className="px-3 py-2">Dịch vụ</th>
            <th className="px-3 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>{items.map(renderRow)}</tbody>
      </table>
    </div>
  );
}
