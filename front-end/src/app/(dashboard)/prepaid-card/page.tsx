// src/app/(dashboard)/prepaid-card/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContexts";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { getPrepaidCardByCustomerId } from "@/features/prepaid-card/api/prepaid-card.api";
import { PrepaidCard } from "@/features/prepaid-card/types";

import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import PrepaidCardDisplay from "@/features/prepaid-card/components/PrepaidCardDisplay";
import TransactionHistory from "@/features/prepaid-card/components/TransactionHistory";
import { Button } from "@/features/shared/components/ui/button";
import Link from "next/link";
import { CreditCard } from "lucide-react";

export default function PrepaidCardPage() {
  const { user } = useAuth();
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();

  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  const {
    data: prepaidCards = [],
    isLoading: loadingCards,
    error,
  } = useQuery<PrepaidCard[]>({
    queryKey: ["prepaidCards", currentUserProfile?.id],
    queryFn: () => getPrepaidCardByCustomerId(currentUserProfile!.id),
    enabled: !!currentUserProfile, // Chỉ fetch khi đã có thông tin khách hàng
  });

  const isLoading = loadingCustomers || loadingCards;

  if (isLoading) {
    return <FullPageLoader text="Đang tải thông tin thẻ của bạn..." />;
  }

  if (error) {
    return <div className="p-8">Lỗi: Không thể tải dữ liệu thẻ trả trước.</div>;
  }

  const primaryCard = prepaidCards[0]; // Giả sử mỗi khách hàng chỉ có 1 thẻ

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Thẻ trả trước"
        description="Quản lý số dư và xem lịch sử giao dịch thẻ của bạn."
      />

      {primaryCard ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <PrepaidCardDisplay card={primaryCard} />
          </div>
          <div className="lg:col-span-2">
            <TransactionHistory transactions={primaryCard.history} />
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <CreditCard className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">
            Bạn chưa có thẻ trả trước
          </h2>
          <p className="mt-2 text-muted-foreground">
            Mua thẻ để nhận ưu đãi và thanh toán tiện lợi hơn.
          </p>
          <Button asChild className="mt-6">
            {/* Tương lai sẽ dẫn đến trang mua thẻ */}
            <Link href="/products">Khám phá ngay</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
