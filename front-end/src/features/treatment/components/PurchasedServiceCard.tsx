// src/features/treatment/components/PurchasedServiceCard.tsx
"use client";

import { Service } from "@/features/service/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CalendarPlus, Tag, Clock } from "lucide-react";
import { PurchasedService } from "@/features/customer/types";

interface PurchasedServiceCardProps {
  purchasedService: PurchasedService;
  serviceInfo?: Service; // serviceInfo có thể là undefined nếu không tìm thấy
}

const PurchasedServiceCard = ({
  purchasedService,
  serviceInfo,
}: PurchasedServiceCardProps) => {
  // Nếu không có thông tin chi tiết về dịch vụ, không hiển thị card này
  if (!serviceInfo) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4">
          <Image
            src={serviceInfo.imageUrl}
            alt={serviceInfo.name}
            width={128}
            height={128}
            className="rounded-lg object-cover w-32 h-32"
          />
          <div className="flex-1">
            <CardTitle className="text-xl">{serviceInfo.name}</CardTitle>
            <CardDescription className="mt-2 flex items-center gap-4">
              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4" />
                <span>{serviceInfo.duration} phút</span>
              </div>
              <div className="flex items-center">
                <Tag className="mr-1.5 h-4 w-4" />
                <span className="font-semibold">
                  {new Intl.NumberFormat("vi-VN").format(serviceInfo.price)} VNĐ
                </span>
              </div>
            </CardDescription>
            <p className="text-sm text-primary font-semibold mt-2">
              Số lượt còn lại: {purchasedService.quantity}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="border-t pt-4 justify-end">
        <Button asChild>
          <Link href={`/booking?serviceId=${serviceInfo.id}`}>
            <CalendarPlus className="w-4 h-4 mr-2" />
            Đặt lịch ngay
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PurchasedServiceCard;
