"use client";

import { useMemo } from "react";
import { useAppointments } from "@/features/appointments/store";
import { hhmm, isTodayIso } from "@/lib/dt";
import type { Status } from "@/features/appointments/types";

const nextOf: Record<Status, Status | null> = {
  PENDING: "CHECKED_IN",
  CHECKED_IN: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: null,
  CANCELLED: null,
};

export default function ReceptionCheckinPage() {
  const all = useAppointments((s) => s.items); // ✅ snapshot ổn định
  const items = useMemo(() => all.filter((a) => isTodayIso(a.start)), [all]); // ✅ derive

  const setStatus = useAppointments((s) => s.setStatus);
  const cancel = useAppointments((s) => s.cancel);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Check-in hôm nay</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-3 py-2">Giờ</th>
            <th className="px-3 py-2">Khách</th>
            <th className="px-3 py-2">Dịch vụ</th>
            <th className="px-3 py-2">Trạng thái</th>
            <th className="px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => {
            const next = nextOf[a.status];
            return (
              <tr key={a.id} className="border-b">
                <td className="px-3 py-2">{hhmm(a.start)}</td>
                <td className="px-3 py-2">{a.customerName}</td>
                <td className="px-3 py-2">{a.serviceName}</td>
                <td className="px-3 py-2">{a.status}</td>
                <td className="px-3 py-2 space-x-2">
                  {next && (
                    <button
                      className="rounded border px-2 py-1"
                      onClick={() => setStatus(a.id, next)}
                    >
                      {next === "CHECKED_IN"
                        ? "Check-in"
                        : next === "IN_PROGRESS"
                        ? "Bắt đầu"
                        : "Hoàn tất"}
                    </button>
                  )}
                  {a.status !== "DONE" && a.status !== "CANCELLED" && (
                    <button
                      className="rounded border px-2 py-1"
                      onClick={() => cancel(a.id)}
                    >
                      Hủy
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
