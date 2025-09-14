"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContexts";
import { TreatmentPackage } from "@/features/treatment/types";
import { getCustomerTreatments } from "@/features/treatment/api/treatment.api";
import TreatmentCard from "@/features/treatment/components/TreatmentCard";
import { getCustomers } from "@/features/customer/api/customer.api";
import { FullCustomerProfile } from "@/features/customer/types";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTreatmentPlans } from "@/features/treatment/hooks/useTreatmentPlans";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useServices } from "@/features/service/hooks/useServices";
import { useReviews } from "@/features/review/hooks/useReviews";
import { toast } from "sonner";
import { ReviewModal } from "@/features/review/components/ReviewModal";
import { createReview } from "@/features/review/api/review.api";
import { ReviewFormValues } from "@/features/review/schemas";
import { NewReviewData } from "@/features/review/types";

export default function TreatmentsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] =
    useState<TreatmentPackage | null>(null);

  // ✅ BƯỚC 1: Lấy danh sách tất cả khách hàng để tìm profile của user hiện tại
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled: !!user,
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

  const { data: treatmentPlans = [], isLoading: loadingPlans } =
    useTreatmentPlans();
  const { data: staff = [], isLoading: loadingStaff } = useStaffs();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      setIsReviewModalOpen(false);
    },
    onError: (error) => toast.error(`Gửi đánh giá thất bại: ${error.message}`),
  });

  const handleOpenReviewModal = (pkg: TreatmentPackage) => {
    setSelectedTreatment(pkg);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (data: ReviewFormValues) => {
    if (!selectedTreatment || !currentUserProfile) return;

    const reviewData: NewReviewData = {
      appointmentId: `pkg-${selectedTreatment.id}`,
      customerId: currentUserProfile.id,
      technicianId: "N/A",
      serviceId: selectedTreatment.treatmentPlanId,
      rating: data.rating,
      comment: data.comment,
    };
    createReviewMutation.mutate(reviewData);
  };

  const isLoading =
    loadingCustomers ||
    loadingTreatments ||
    loadingPlans ||
    loadingStaff ||
    loadingServices ||
    loadingReviews;

  if (isLoading) {
    return <div className="p-8">Đang tải dữ liệu liệu trình...</div>;
  }

  // Phân loại liệu trình
  const inProgressTreatments: TreatmentPackage[] = [];
  const completedTreatments: TreatmentPackage[] = [];

  customerTreatments.forEach((pkg) => {
    const plan = treatmentPlans.find((p) => p.id === pkg.treatmentPlanId);
    if (!plan) return;
    const completedCount = pkg.sessions.filter(
      (s) => s.status === "completed"
    ).length;
    if (completedCount >= plan.totalSessions) {
      completedTreatments.push(pkg);
    } else {
      inProgressTreatments.push(pkg);
    }
  });

  // Hàm render danh sách
  const renderTreatmentList = (
    list: TreatmentPackage[],
    isCompletedList: boolean
  ) => {
    if (list.length === 0) {
      return (
        <p className="text-muted-foreground">
          Không có liệu trình nào trong mục này.
        </p>
      );
    }
    return list.map((pkg) => {
      const planInfo = treatmentPlans.find((p) => p.id === pkg.treatmentPlanId);
      if (!planInfo) return null;
      // Kiểm tra xem liệu trình đã được đánh giá chưa
      const hasReviewed = reviews.some(
        (r) => r.appointmentId === `pkg-${pkg.id}`
      );
      return (
        <TreatmentCard
          key={pkg.id}
          treatmentPackage={pkg}
          planInfo={planInfo}
          staffList={staff}
          serviceList={services}
          isCompleted={isCompletedList}
          hasReviewed={hasReviewed}
          onWriteReview={() => handleOpenReviewModal(pkg)}
        />
      );
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Liệu trình của tôi" />

      <Tabs defaultValue="in-progress">
        <TabsList>
          <TabsTrigger value="in-progress">
            Đang thực hiện ({inProgressTreatments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã hoàn thành ({completedTreatments.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="in-progress" className="mt-4">
          <div className="space-y-6">
            {renderTreatmentList(inProgressTreatments, false)}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div className="space-y-6">
            {renderTreatmentList(completedTreatments, true)}
          </div>
        </TabsContent>
      </Tabs>

      {/* ✅ BƯỚC 4: Thêm Modal vào trang */}
      {selectedTreatment && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
          itemName={
            treatmentPlans.find(
              (p) => p.id === selectedTreatment.treatmentPlanId
            )?.name || "Liệu trình"
          }
          isSubmitting={createReviewMutation.isPending}
        />
      )}
    </div>
  );
}
