import { useQuery } from "@tanstack/react-query";
import { getCustomerTreatments } from "@/features/treatment/api/treatment.api";
import { TreatmentPackage } from "@/features/treatment/types";
import { useAuth } from "@/contexts/AuthContexts";
import { useCustomers } from "@/features/customer/hooks/useCustomers";

export const useTreatments = () => {
  const { user } = useAuth();
  // Tận dụng hook đã có để lấy thông tin khách hàng
  const { data: customers = [] } = useCustomers();
  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  return useQuery<TreatmentPackage[]>({
    // Query key phụ thuộc vào customerId để fetch lại khi người dùng thay đổi
    queryKey: ["customerTreatments", currentUserProfile?.id],
    queryFn: getCustomerTreatments,
    // Chỉ chạy query khi đã có thông tin khách hàng
    enabled: !!currentUserProfile,
    // Lọc dữ liệu ngay sau khi fetch
    select: (data) =>
      data.filter((t) => t.customerId === currentUserProfile?.id),
  });
};
