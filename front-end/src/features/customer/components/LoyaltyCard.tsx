// src/features/customer/components/LoyaltyCard.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/features/shared/components/ui/card";
import { Progress } from "@/features/shared/components/ui/progress";
import { FullCustomerProfile } from "@/features/customer/types";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
interface LoyaltyCardProps {
  customer: FullCustomerProfile;
}

// Giả lập dữ liệu về các hạng thành viên
const loyaltyTiers = {
  Bronze: { goal: 500, color: "text-orange-400" },
  Silver: { goal: 2000, color: "text-slate-400" },
  Gold: { goal: 5000, color: "text-yellow-500" },
};

export function LoyaltyCard({ customer }: LoyaltyCardProps) {
  const rank = customer.rank || "Bronze";
  const points = customer.loyaltyPoints || 0;
  const currentTier = loyaltyTiers[rank];
  // Tìm hạng tiếp theo, nếu có
  const nextTierKey = Object.keys(loyaltyTiers).find(
    (_, index, arr) => arr[index - 1] === rank
  );
  const nextTier = nextTierKey
    ? loyaltyTiers[nextTierKey as keyof typeof loyaltyTiers]
    : null;

  const progress = nextTier ? (points / nextTier.goal) * 100 : 100;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className={cn("h-6 w-6", currentTier.color)} />
          Thành viên {rank}
        </CardTitle>
        <CardDescription>
          Cảm ơn bạn đã là một khách hàng thân thiết của Serenity Spa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-lg">
              {points.toLocaleString("vi-VN")} Điểm
            </span>
            {nextTier && (
              <span className="text-sm text-muted-foreground">
                Cần {nextTier.goal.toLocaleString("vi-VN")} điểm để lên hạng{" "}
                {nextTierKey}
              </span>
            )}
          </div>
          <Progress value={progress} className="w-full" />
        </div>
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">Quyền lợi hiện tại:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Giảm giá 5% cho tất cả dịch vụ.</li>
            <li>Ưu đãi đặc biệt vào tháng sinh nhật.</li>
            <li>Tích điểm cho mỗi lần chi tiêu.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
