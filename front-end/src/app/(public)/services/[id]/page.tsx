"use client";

import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "@/features/service/api/service.api";
import { getReviews } from "@/features/review/api/review.api"; // **MỚI**
import { Review } from "@/features/review/types"; // **MỚI**
import { ReviewList } from "@/features/review/components/ReviewList"; // **MỚI**
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";

interface ServiceDetailPageProps {
  params: { id: string };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = params;

  const {
    data: service,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
  });

  // **MỚI: Query để lấy tất cả đánh giá**
  const { data: allReviews = [], isLoading: isLoadingReviews } = useQuery<
    Review[]
  >({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

  if (isLoading || isLoadingReviews) {
    return <div>Đang tải...</div>;
  }

  if (error || !service) {
    notFound();
  }

  // **MỚI: Lọc ra các đánh giá cho dịch vụ này**
  const serviceReviews = allReviews.filter(
    (review) => review.serviceId === service.id
  );

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <Image
            src={service.imageUrl}
            alt={service.name}
            width={600}
            height={600}
            className="rounded-lg object-cover w-full"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
          <p className="text-muted-foreground mb-6">{service.description}</p>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              <span>{service.duration} phút</span>
            </div>
            <div className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              <span className="font-semibold">
                {new Intl.NumberFormat("vi-VN").format(service.price)} VNĐ
              </span>
            </div>
          </div>
          <Button size="lg">Đặt lịch ngay</Button>
        </div>
      </div>

      {/* **MỚI: Hiển thị component danh sách đánh giá** */}
      <ReviewList reviews={serviceReviews} />
    </div>
  );
}
