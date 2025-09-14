"use client";

import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "@/features/service/api/service.api";
import { ReviewList } from "@/features/review/components/ReviewList"; // **MỚI**
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useReviews } from "@/features/review/hooks/useReviews";

interface ServiceDetailPageProps {
  params: { id: string };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = params;
  const [mainImage, setMainImage] = useState<string | null>(null);

  const {
    data: service,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
  });

  // **MỚI: Query để lấy tất cả đánh giá**
  const { data: allReviews = [], isLoading: isLoadingReviews } = useReviews();

  useEffect(() => {
    // Luôn ưu tiên hiển thị ảnh chính (imageUrl) khi tải trang
    if (service?.imageUrl) {
      setMainImage(service.imageUrl);
    }
    // Nếu không có ảnh chính, lấy ảnh đầu tiên trong danh sách ảnh phụ
    else if (service?.imageUrls && service.imageUrls.length > 0) {
      setMainImage(service.imageUrls[0]);
    }
  }, [service]);

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

  const thumbnailImages = [
    service.imageUrl,
    ...(service.imageUrls || []),
  ].filter((url): url is string => !!url);

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div>
          {/* Ảnh chính */}
          <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-lg shadow-lg border bg-white">
            <Image
              src={mainImage || "/images/product-placeholder.png"}
              alt={service.name}
              fill
              className="object-contain p-4 transition-all duration-300"
            />
          </div>
          {/* Dải ảnh phụ (thumbnails) */}
          <div className="flex gap-2">
            {thumbnailImages.map((url, index) => (
              <div
                key={index}
                className={cn(
                  "relative w-20 h-20 rounded-md cursor-pointer overflow-hidden ring-2 ring-transparent transition-all hover:ring-primary/50 bg-white border",
                  mainImage === url && "ring-primary"
                )}
                onClick={() => setMainImage(url)}
              >
                <Image
                  src={url}
                  alt={`${service.name} thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-1"
                />
              </div>
            ))}
          </div>
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
