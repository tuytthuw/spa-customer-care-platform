// src/app/(public)/treatment-plans/[id]/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getTreatmentPlanById } from "@/features/treatment/api/treatment.api";
import { ReviewList } from "@/features/review/components/ReviewList";
import TreatmentSteps from "@/features/treatment/components/TreatmentSteps";
import { notFound } from "next/navigation";
import { PackageCheck, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import { useReviews } from "@/features/review/hooks/useReviews";
import { useServices } from "@/features/service/hooks/useServices";
import { PurchaseActions } from "@/features/shared/components/common/PurchaseActions";
import { DetailPageLayout } from "@/features/shared/components/common/DetailPageLayout";

interface TreatmentPlanDetailPageProps {
  params: { id: string };
}

export default function TreatmentPlanDetailPage({
  params,
}: TreatmentPlanDetailPageProps) {
  const { id } = params;
  const [mainImage, setMainImage] = useState<string | null>(null);

  const {
    data: plan,
    isLoading: isLoadingPlan,
    error,
  } = useQuery({
    queryKey: ["treatmentPlan", id],
    queryFn: () => getTreatmentPlanById(id),
  });

  const { data: allReviews = [], isLoading: isLoadingReviews } = useReviews();
  const { data: allServices = [], isLoading: isLoadingServices } =
    useServices();

  useEffect(() => {
    if (plan?.imageUrl) {
      setMainImage(plan.imageUrl);
    } else if (plan?.imageUrls && plan.imageUrls.length > 0) {
      setMainImage(plan.imageUrls[0]);
    }
  }, [plan]);

  const isLoading = isLoadingPlan || isLoadingReviews || isLoadingServices;

  if (isLoading) {
    return <FullPageLoader text="Đang tải chi tiết liệu trình..." />;
  }

  if (error || !plan) {
    notFound();
  }

  const planReviews = allReviews.filter(
    (review) => review.serviceId === plan.id
  );

  const thumbnailImages = [plan.imageUrl, ...(plan.imageUrls || [])].filter(
    (url): url is string => !!url
  );

  return (
    <DetailPageLayout
      mainImage={mainImage}
      imageAlt={plan.name}
      thumbnailUrls={thumbnailImages}
      onThumbnailClick={setMainImage}
      title={<h1 className="text-4xl font-bold mb-4">{plan.name}</h1>}
      description={<p className="text-muted-foreground">{plan.description}</p>}
      details={
        <>
          <div className="flex items-center">
            <PackageCheck className="mr-2 h-5 w-5" />
            <span>{plan.totalSessions} buổi</span>
          </div>
          <div className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            <span className="font-semibold">
              {new Intl.NumberFormat("vi-VN").format(plan.price)} VNĐ
            </span>
          </div>
        </>
      }
      purchaseActions={
        <PurchaseActions
          item={{
            id: plan.id,
            name: plan.name,
            price: plan.price,
            imageUrl: plan.imageUrl,
            type: "treatment",
          }}
        />
      }
      treatmentSteps={<TreatmentSteps plan={plan} allServices={allServices} />}
    >
      <div className="mt-12">
        <ReviewList reviews={planReviews} />
      </div>
    </DetailPageLayout>
  );
}
