// src/app/(dashboard)/manage-loyalty/page.tsx
"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { FullPageLoader } from "@/components/ui/spinner";
import LoyaltySettingsForm from "@/features/loyalty/components/LoyaltySettingsForm";
import { LoyaltySettings } from "@/features/loyalty/types";
import { useQuery } from "@tanstack/react-query";

// Hàm giả lập lấy dữ liệu cài đặt từ API
const getLoyaltySettings = async (): Promise<LoyaltySettings> => {
  // Trong thực tế, bạn sẽ fetch từ API thật
  // Ở đây, chúng ta trả về dữ liệu mẫu để xây dựng giao diện
  return {
    pointsPerVnd: 10000, // 10,000 VNĐ = 1 điểm
    tiers: [
      {
        id: "bronze",
        name: "Đồng",
        pointGoal: 0,
        color: "#cd7f32",
        benefits: "Tích điểm sau mỗi lần chi tiêu;Ưu đãi sinh nhật.",
      },
      {
        id: "silver",
        name: "Bạc",
        pointGoal: 500,
        color: "#c0c0c0",
        benefits: "Toàn bộ quyền lợi hạng Đồng;Giảm giá 5% cho dịch vụ.",
      },
      {
        id: "gold",
        name: "Vàng",
        pointGoal: 2000,
        color: "#ffd700",
        benefits:
          "Toàn bộ quyền lợi hạng Bạc;Giảm giá 10% cho dịch vụ;Miễn phí 1 lần gội đầu mỗi tháng.",
      },
    ],
  };
};

export default function ManageLoyaltyPage() {
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery<LoyaltySettings>({
    queryKey: ["loyaltySettings"],
    queryFn: getLoyaltySettings,
  });

  if (isLoading) {
    return <FullPageLoader text="Đang tải cài đặt..." />;
  }

  if (error || !settings) {
    return (
      <div className="p-8">
        Lỗi: Không thể tải dữ liệu chương trình khách hàng thân thiết.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Khách hàng thân thiết"
        description="Thiết lập tỷ lệ tích điểm và các hạng thành viên cho spa của bạn."
      />
      <LoyaltySettingsForm initialData={settings} />
    </div>
  );
}
