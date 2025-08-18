"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Appointment, AppointmentInput, Status } from "./types";

type State = {
  items: Appointment[];
  add: (
    p: AppointmentInput & {
      customerId: string;
      customerName: string;
      customerEmail: string;
    }
  ) => string;
  setStatus: (id: string, status: Status) => void;
  cancel: (id: string) => void;
};

export const useAppointments = create<State>()(
  persist(
    (set) => ({
      items: [],
      add: (p) => {
        const id = nanoid();
        const a: Appointment = { id, status: "PENDING", ...p };
        set((s) => ({ items: [a, ...s.items] }));
        return id;
      },
      setStatus: (id, status) =>
        set((s) => ({
          items: s.items.map((it) => (it.id === id ? { ...it, status } : it)),
        })),
      cancel: (id) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id ? { ...it, status: "CANCELLED" } : it
          ),
        })),
    }),
    { name: "spa_appointments" }
  )
);
