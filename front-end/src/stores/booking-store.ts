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
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
    startReschedule: (service: Service, appointmentId: string) => void;
  };
}

// ✅ KHAI BÁO HẰNG SỐ BỊ THIẾU Ở ĐÂY
const initialState = {
  step: 1,
  service: null,
  date: new Date(),
  time: "",
  rescheduleId: null,
};

const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  service: null,
  date: new Date(),
  time: "",
  rescheduleId: null,
  actions: {
    // CHỈ CẬP NHẬT DỮ LIỆU, KHÔNG CHUYỂN BƯỚC
    setService: (service) => set({ service }),
    setDateTime: (date, time) => set({ date, time }),

    // Các actions khác giữ nguyên
    startReschedule: (service, rescheduleId) =>
      set({ service, rescheduleId, step: 2, date: new Date(), time: "" }),
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    prevStep: () => set((state) => ({ step: state.step - 1 })),
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
