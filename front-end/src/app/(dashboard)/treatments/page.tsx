"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContexts";
import { TreatmentPackage } from "@/types/treatment";
import { TreatmentPlan } from "@/types/treatmentPlan";
import { Staff } from "@/types/staff";
import {
  getCustomerTreatments,
  getTreatmentPlans,
} from "@/services/treatment.api";
import { getStaff } from "@/services/staff.api";
import TreatmentCard from "@/features/treatment/TreatmentCard";

export default function TreatmentsPage() {
  const { user } = useAuth();

  // Fetch tất cả dữ liệu cần thiết
  const { data: customerTreatments = [], isLoading: loadingTreatments } =
    useQuery<TreatmentPackage[]>({
      queryKey: ["customerTreatments", user?.id], // Lọc theo user ID
      queryFn: getCustomerTreatments,
      // Lọc phía client để chỉ lấy liệu trình của user đang đăng nhập
      select: (data) => data.filter((pkg) => pkg.customerId === "cus-1"), // Giả lập user 'cus-1'
    });

  const { data: treatmentPlans = [], isLoading: loadingPlans } = useQuery<
    TreatmentPlan[]
  >({
    queryKey: ["treatmentPlans"],
    queryFn: getTreatmentPlans,
  });

  const { data: staff = [], isLoading: loadingStaff } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  const isLoading = loadingTreatments || loadingPlans || loadingStaff;

  if (isLoading) {
    return <div className="p-8">Đang tải dữ liệu liệu trình...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Liệu trình của tôi</h1>
      {customerTreatments.length > 0 ? (
        <div className="space-y-6">
          {customerTreatments.map((pkg) => {
            const planInfo = treatmentPlans.find(
              (p) => p.id === pkg.treatmentPlanId
            );
            if (!planInfo) return null;

            return (
              <TreatmentCard
                key={pkg.id}
                treatmentPackage={pkg}
                planInfo={planInfo}
                staffList={staff}
              />
            );
          })}
        </div>
      ) : (
        <p>Bạn hiện không có liệu trình nào đang hoạt động.</p>
      )}
    </div>
  );
}
