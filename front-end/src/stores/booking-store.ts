// src/stores/booking-store.ts

import { create } from "zustand";
import { Service } from "@/features/service/types";

interface BookingState {
  step: number;
  service: Service | null;
  date: Date;
  time: string;
  rescheduleId: string | null;
  actions: {
    setService: (service: Service) => void;
    setDateTime: (date: Date, time: string) => void;
    startReschedule: (service: Service, rescheduleId: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
  };
}

const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  service: null,
  date: new Date(),
  time: "",
  rescheduleId: null,
  actions: {
    setService: (service) => set((state) => ({ ...state, service, step: 2 })),
    setDateTime: (date, time) =>
      set((state) => ({ ...state, date, time, step: 3 })),
    startReschedule: (service, rescheduleId) =>
      set({ service, rescheduleId, step: 2, date: new Date(), time: "" }),
    nextStep: () => set((state) => ({ ...state, step: state.step + 1 })),
    prevStep: () => set((state) => ({ ...state, step: state.step - 1 })),
    reset: () =>
      set({
        step: 1,
        service: null,
        date: new Date(),
        time: "",
        rescheduleId: null,
      }),
  },
}));

export default useBookingStore;
