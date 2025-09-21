import { useQuery } from "@tanstack/react-query";
import { getCustomerTreatments } from "@/features/treatment/api/treatment.api";
import { TreatmentPackage } from "@/features/treatment/types";
import { useAuth } from "@/contexts/AuthContexts";
import { useCustomers } from "@/features/customer/hooks/useCustomers";

export const useTreatments = () => {
  const { user } = useAuth();
  const { data: customers = [] } = useCustomers();
  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  return useQuery<TreatmentPackage[]>({
    queryKey: ["customerTreatments", currentUserProfile?.id],

    queryFn: () => getCustomerTreatments(currentUserProfile!.id),

    enabled: !!currentUserProfile,
  });
};
