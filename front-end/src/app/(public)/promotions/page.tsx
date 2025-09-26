"use client";

import { usePromotions } from "@/features/promotion/hooks/usePromotions";
import { PromotionCard } from "@/features/promotion/components/PromotionCard";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { useMemo } from "react";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";
export default function PromotionsPage() {
  const { data: promotions, isLoading, error } = usePromotions();

  const activePromotions = useMemo(() => {
    return promotions?.filter((promo) => promo.status === "active") || [];
  }, [promotions]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error) {
    // Thêm style để thông báo lỗi rõ ràng hơn
    return <div> Không thể tải khuyến mãi</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Ưu đãi & Khuyến mãi"
        description="Đừng bỏ lỡ những chương trình khuyến mãi hấp dẫn nhất từ Serenity Spa!"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {activePromotions?.map((promo) => (
          <PromotionCard key={promo.id} promotion={promo} />
        ))}
      </div>
    </div>
  );
}
