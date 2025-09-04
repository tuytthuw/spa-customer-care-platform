// src/features/appointment/hooks/useAppointments.ts
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import { Appointment } from "@/features/appointment/types";

export const useAppointments = () => {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });
};
