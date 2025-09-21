// src/features/customer-schedules/hooks/useCustomerScheduleData.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContexts";

// Import tất cả các API call cần thiết
import { getAppointmentsByCustomerId } from "@/features/appointment/api/appointment.api";
import { getCustomerTreatments } from "@/features/treatment/api/treatment.api";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { FullCustomerProfile } from "@/features/customer/types";
import { useServices } from "@/features/service/hooks/useServices";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useReviews } from "@/features/review/hooks/useReviews";
import { useTreatmentPlans } from "@/features/treatment/hooks/useTreatmentPlans";

export const useCustomerScheduleData = () => {
  const { user } = useAuth();

  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const currentUserProfile = customers.find(
    (c: FullCustomerProfile) => c.userId === user?.id
  );
  const { data: appointments = [], isLoading: loadingAppts } = useQuery({
    queryKey: ["appointments", { customerId: currentUserProfile?.id }],
    queryFn: () => getAppointmentsByCustomerId(currentUserProfile!.id),
    enabled: !!currentUserProfile,
  });

  const { data: treatments = [], isLoading: loadingTreatments } = useQuery({
    queryKey: ["customerTreatments", currentUserProfile?.id],
    queryFn: () => getCustomerTreatments(currentUserProfile!.id),
    enabled: !!currentUserProfile,
  });

  // Các hooks khác không phụ thuộc vào customerId có thể giữ nguyên
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: treatmentPlans = [], isLoading: loadingPlans } =
    useTreatmentPlans();
  const { data: staff = [], isLoading: loadingStaff } = useStaffs();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();

  const isLoading =
    loadingCustomers ||
    loadingAppts ||
    loadingTreatments ||
    loadingServices ||
    loadingPlans ||
    loadingStaff ||
    loadingReviews;

  return {
    isLoading,
    data: {
      customers,
      appointments,
      treatments,
      services,
      treatmentPlans,
      staff,
      reviews,
      currentUserProfile,
    },
  };
};
