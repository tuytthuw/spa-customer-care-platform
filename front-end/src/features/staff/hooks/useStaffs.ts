// src/features/staff/hooks/useStaff.ts
import { useQuery } from "@tanstack/react-query";
import { getStaffProfiles } from "@/features/staff/api/staff.api";
import { FullStaffProfile } from "@/features/staff/types";

export const useStaffs = () => {
  return useQuery<FullStaffProfile[]>({
    queryKey: ["staff"],
    queryFn: getStaffProfiles,
  });
};
