// src/features/treatment/components/PurchasedItemCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, CalendarPlus } from "lucide-react";

import { TreatmentPackage, TreatmentPlan } from "@/features/treatment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import { PurchasedService } from "@/features/customer/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import SessionHistory from "@/features/my-packages/components/SessionHistory";

// Kiểu dữ liệu cho props của component
interface PurchasedItemCardProps {
  item:
    | { type: "treatment"; data: TreatmentPackage; details?: TreatmentPlan }
    | { type: "service"; data: PurchasedService; details?: Service };
  staffList: Staff[];
  serviceList: Service[];
  hasReviewed: boolean;
  isCompleted: boolean;
  onWriteReview: () => void;
}

export default function PurchasedItemCard({
  item,
  staffList,
  serviceList,
  hasReviewed,
  isCompleted,
  onWriteReview,
}: PurchasedItemCardProps) {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  if (!item.details) return null; // Không hiển thị nếu không có thông tin chi tiết

  const { details } = item;
  const isTreatment = item.type === "treatment";

  // Tính toán tiến độ cho liệu trình
  const progress = isTreatment
    ? (item.data.completedSessions / item.data.totalSessions) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4">
          <Image
            src={details.imageUrl}
            alt={details.name}
            width={128}
            height={128}
            className="rounded-lg object-cover w-32 h-32"
          />
          <div className="flex-1">
            <CardTitle className="text-xl">{details.name}</CardTitle>
            <CardDescription className="mt-1">
              {isTreatment
                ? `Đã hoàn thành ${item.data.completedSessions} / ${item.data.totalSessions} buổi`
                : `Dịch vụ lẻ đã mua`}
            </CardDescription>
            {isTreatment ? (
              <Progress value={progress} className="w-full my-3" />
            ) : (
              <p className="text-sm text-primary font-semibold my-3">
                Số lượt còn lại: {item.data.quantity}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Ngày mua:{" "}
              {new Date(
                isTreatment ? item.data.purchaseDate : new Date().toISOString()
              ).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </CardHeader>

      {isTreatment && isHistoryVisible && (
        <CardContent>
          <SessionHistory
            sessions={item.data.sessions}
            staffList={staffList}
            serviceList={serviceList}
            treatmentPackageId={item.data.id}
          />
        </CardContent>
      )}

      <CardFooter className="border-t pt-4 justify-between">
        {isTreatment ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
          >
            {isHistoryVisible ? "Ẩn chi tiết" : "Xem chi tiết"}
            {isHistoryVisible ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </Button>
        ) : (
          <div /> // Placeholder để giữ layout
        )}

        <div className="flex items-center gap-2">
          {!isTreatment && (
            <Button asChild>
              <Link href={`/booking?serviceId=${details.id}`}>
                <CalendarPlus className="w-4 h-4 mr-2" />
                Đặt lịch
              </Link>
            </Button>
          )}
          {isCompleted && !hasReviewed && (
            <Button onClick={onWriteReview}>Viết đánh giá</Button>
          )}
          {isCompleted && hasReviewed && (
            <Button variant="outline" disabled>
              Đã đánh giá
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
