import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/features/roles/api/role.api";
import { Role } from "@/features/roles/types";

export const useRoles = () => {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
};
