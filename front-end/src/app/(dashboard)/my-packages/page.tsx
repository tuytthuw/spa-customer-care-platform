// src/app/(dashboard)/my-packages/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContexts";
import { toast } from "sonner";

// Import các types cần thiết
import { TreatmentPackage, TreatmentPlan } from "@/features/treatment/types";
import {
  FullCustomerProfile,
  PurchasedService,
} from "@/features/customer/types";
import { ReviewFormValues } from "@/features/review/schemas";
import { NewReviewData } from "@/features/review/types";

// Import các API actions
import { getCustomerTreatments } from "@/features/treatment/api/treatment.api";
import { getCustomers } from "@/features/customer/api/customer.api";
import { createReview } from "@/features/review/api/review.api";

// Import các custom hooks
import { useTreatmentPlans } from "@/features/treatment/hooks/useTreatmentPlans";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useServices } from "@/features/service/hooks/useServices";
import { useReviews } from "@/features/review/hooks/useReviews";

// Import components
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/shared/components/ui/tabs";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import { ReviewModal } from "@/features/review/components/ReviewModal";
import PurchasedItemCard from "@/features/customer-schedules/components/PurchasedItemCard"; // <--- IMPORT COMPONENT MỚI

// Định nghĩa kiểu cho một item trong danh sách hợp nhất
type PurchasedItem =
  | { type: "treatment"; data: TreatmentPackage }
  | { type: "service"; data: PurchasedService };

export default function MyPackagesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    type: "treatment";
    data: TreatmentPackage;
  } | null>(null);

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled: !!user,
  });

  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  const { data: customerTreatments = [], isLoading: loadingTreatments } =
    useQuery<TreatmentPackage[]>({
      queryKey: ["customerTreatments", currentUserProfile?.id],
      queryFn: () => getCustomerTreatments(),
      enabled: !!currentUserProfile,
      select: (data) =>
        data.filter((pkg) => pkg.customerId === currentUserProfile?.id),
    });

  const { data: treatmentPlans = [], isLoading: loadingPlans } =
    useTreatmentPlans();
  const { data: staff = [], isLoading: loadingStaff } = useStaffs();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();

  const purchasedServices = currentUserProfile?.purchasedServices || [];

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
    setSelectedItem({ type: "treatment", data: pkg });
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (data: ReviewFormValues) => {
    if (!selectedItem || !currentUserProfile) return;

    const reviewData: NewReviewData = {
      appointmentId: `pkg-${selectedItem.data.id}`,
      customerId: currentUserProfile.id,
      technicianId: "N/A",
      serviceId: selectedItem.data.treatmentPlanId,
      rating: data.rating,
      comment: data.comment,
    };
    createReviewMutation.mutate(reviewData);
  };

  const getSelectedItemName = () => {
    if (!selectedItem) return "";
    const plan = treatmentPlans.find(
      (p: TreatmentPlan) => p.id === selectedItem.data.treatmentPlanId
    );
    return plan?.name || "Liệu trình";
  };

  const isLoading =
    loadingCustomers ||
    loadingTreatments ||
    loadingPlans ||
    loadingStaff ||
    loadingServices ||
    loadingReviews;

  if (isLoading) {
    return <FullPageLoader text="Đang tải dữ liệu..." />;
  }

  // Phân loại các mục đã mua
  const notStartedItems: PurchasedItem[] = [];
  const inProgressItems: PurchasedItem[] = [];
  const completedItems: PurchasedItem[] = [];

  customerTreatments.forEach((pkg) => {
    const completedCount = pkg.sessions.filter(
      (s) => s.status === "completed"
    ).length;
    if (completedCount === 0) {
      notStartedItems.push({ type: "treatment", data: pkg });
    } else if (completedCount < pkg.totalSessions) {
      inProgressItems.push({ type: "treatment", data: pkg });
    } else {
      completedItems.push({ type: "treatment", data: pkg });
    }
  });

  purchasedServices.forEach((service) => {
    if (service.quantity > 0) {
      notStartedItems.push({ type: "service", data: service });
    }
  });

  const renderItemsList = (list: PurchasedItem[]) => {
    if (list.length === 0) {
      return (
        <p className="text-muted-foreground">
          Không có mục nào trong trạng thái này.
        </p>
      );
    }
    return list.map((item) => {
      if (item.type === "treatment") {
        const pkg = item.data;
        const planInfo = treatmentPlans.find(
          (p) => p.id === pkg.treatmentPlanId
        );
        const hasReviewed = reviews.some(
          (r) => r.appointmentId === `pkg-${pkg.id}`
        );
        const isCompleted = pkg.completedSessions >= pkg.totalSessions;

        return (
          <PurchasedItemCard
            key={`treat-${pkg.id}`}
            item={{ type: "treatment", data: pkg, details: planInfo }}
            staffList={staff}
            serviceList={services}
            isCompleted={isCompleted}
            hasReviewed={hasReviewed}
            onWriteReview={() => handleOpenReviewModal(pkg)}
          />
        );
      }

      if (item.type === "service") {
        const purchased = item.data;
        const serviceInfo = services.find((s) => s.id === purchased.serviceId);
        if (!serviceInfo) return null;

        return (
          <PurchasedItemCard
            key={`serv-${purchased.serviceId}`}
            item={{ type: "service", data: purchased, details: serviceInfo }}
            staffList={staff}
            serviceList={services}
            isCompleted={false}
            hasReviewed={false}
            onWriteReview={() => {}}
          />
        );
      }
      return null;
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Dịch vụ & Liệu trình của tôi" />
      <Tabs defaultValue="not-started">
        <TabsList className="grid w-full grid-cols-3 md:w-auto h-auto">
          <TabsTrigger value="not-started">
            Chưa thực hiện ({notStartedItems.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Đang thực hiện ({inProgressItems.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã hoàn thành ({completedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="not-started" className="mt-4">
          <div className="space-y-6">{renderItemsList(notStartedItems)}</div>
        </TabsContent>
        <TabsContent value="in-progress" className="mt-4">
          <div className="space-y-6">{renderItemsList(inProgressItems)}</div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div className="space-y-6">{renderItemsList(completedItems)}</div>
        </TabsContent>
      </Tabs>

      {selectedItem && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
          itemName={getSelectedItemName()}
          isSubmitting={createReviewMutation.isPending}
        />
      )}
    </div>
  );
}
