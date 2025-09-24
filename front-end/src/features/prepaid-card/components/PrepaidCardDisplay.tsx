// src/features/prepaid-card/components/PrepaidCardDisplay.tsx
"use client";

import { PrepaidCard } from "@/features/prepaid-card/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/features/shared/components/ui/card";
import { Wallet, Sparkles } from "lucide-react";

interface PrepaidCardDisplayProps {
  card: PrepaidCard;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export default function PrepaidCardDisplay({ card }: PrepaidCardDisplayProps) {
  return (
    <Card className="bg-gradient-to-tr from-primary via-primary/80 to-secondary text-primary-foreground shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Thẻ trả trước</CardTitle>
          <Sparkles className="w-6 h-6" />
        </div>
        <CardDescription className="text-primary-foreground/80">
          Sử dụng để thanh toán nhanh chóng và tiện lợi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-primary-foreground/80">Số dư hiện tại</p>
          <p className="text-4xl font-bold tracking-tight">
            {formatCurrency(card.balance)}
          </p>
        </div>
        <div className="flex justify-between items-end">
          <p className="font-mono tracking-widest text-lg">{card.cardNumber}</p>
          <div className="text-right">
            <p className="text-xs text-primary-foreground/80">Ngày tạo</p>
            <p className="text-sm font-medium">
              {new Date(card.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
