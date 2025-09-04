// Gợi ý: Tạo file src/features/customer/hooks/useCustomers.ts
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/features/customer/api/customer.api";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"], // <-- Query key duy nhất
    queryFn: getCustomers,
  });
};
