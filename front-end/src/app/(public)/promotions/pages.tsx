"use client";

import { usePromotions } from "@/features/promotion/hooks/usePromotions";
import { PromotionCard } from "@/features/promotion/components/PromotionCard";
import { PageHeader } from "@/components/common/PageHeader";
import { FullPageLoader } from "@/components/ui/spinner";
export default function PromotionsPage() {
  const { data: promotions, isLoading, error } = usePromotions();

  if (isLoading) {
    return <FullPageLoader text="Đang tải dữ liệu khuyến mãi..." />;
  }

  if (error) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu khuyến mãi.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Ưu đãi & Khuyến mãi"
        description="Đừng bỏ lỡ những chương trình khuyến mãi hấp dẫn nhất từ Serenity Spa!"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {promotions?.map((promo) => (
          <PromotionCard key={promo.id} promotion={promo} />
        ))}
      </div>
    </div>
  );
}
