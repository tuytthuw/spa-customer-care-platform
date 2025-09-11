"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContexts";
import { TreatmentPackage } from "@/features/treatment/types";
import { TreatmentPlan } from "@/features/treatment/types";
import { Staff } from "@/features/staff/types";
import {
  getCustomerTreatments,
  getTreatmentPlans,
} from "@/features/treatment/api/treatment.api";
import { getStaff } from "@/features/staff/api/staff.api";
import { Service } from "@/features/service/types";
import { getServices } from "@/features/service/api/service.api";
import TreatmentCard from "@/features/treatment/components/TreatmentCard";
import { getCustomers } from "@/features/customer/api/customer.api";
import { FullCustomerProfile } from "@/features/customer/types";
import { PageHeader } from "@/components/common/PageHeader";

export default function TreatmentsPage() {
  const { user } = useAuth();

  // ✅ BƯỚC 1: Lấy danh sách tất cả khách hàng để tìm profile của user hiện tại
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled: !!user, // Chỉ chạy khi đã có user
  });

  // Tìm customer profile tương ứng với user đang đăng nhập
  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  const { data: customerTreatments = [], isLoading: loadingTreatments } =
    useQuery<TreatmentPackage[]>({
      queryKey: ["customerTreatments", user?.id], // Lọc theo user ID
      queryFn: getCustomerTreatments,
      // Lọc phía client để chỉ lấy liệu trình của user đang đăng nhập
      select: (data) =>
        data.filter((pkg) => pkg.customerId === currentUserProfile?.id),
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

  const { data: services = [], isLoading: loadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const isLoading =
    loadingCustomers ||
    loadingTreatments ||
    loadingPlans ||
    loadingStaff ||
    loadingServices;

  if (isLoading) {
    return <div className="p-8">Đang tải dữ liệu liệu trình...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Liệu trình của tôi" />
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
                serviceList={services}
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
