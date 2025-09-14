// src/app/(public)/treatment-plans/[id]/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getTreatmentPlanById } from "@/features/treatment/api/treatment.api";
import { getServices } from "@/features/service/api/service.api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Service } from "@/features/service/types";
import { Separator } from "@/components/ui/separator";
import { FullPageLoader } from "@/components/ui/spinner";
import TreatmentSteps from "@/features/treatment/components/TreatmentSteps";

interface TreatmentPlanDetailPageProps {
  params: { id: string };
}

export default function TreatmentPlanDetailPage({
  params,
}: TreatmentPlanDetailPageProps) {
  const { id } = params;
  const [mainImage, setMainImage] = useState<string | null>(null);

  // Fetch thông tin liệu trình
  const {
    data: plan,
    isLoading: isLoadingPlan,
    error,
  } = useQuery({
    queryKey: ["treatmentPlan", id],
    queryFn: () => getTreatmentPlanById(id),
  });

  // Fetch tất cả dịch vụ để lấy thông tin cho các bước
  const { data: allServices = [], isLoading: isLoadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  useEffect(() => {
    if (plan?.imageUrl) {
      setMainImage(plan.imageUrl);
    } else if (plan?.imageUrls && plan.imageUrls.length > 0) {
      setMainImage(plan.imageUrls[0]);
    }
  }, [plan]);

  const isLoading = isLoadingPlan || isLoadingServices;

  if (isLoading) {
    return <FullPageLoader text="Đang tải chi tiết liệu trình..." />;
  }

  if (error || !plan) {
    notFound();
  }

  // Lấy ra danh sách các dịch vụ duy nhất có trong liệu trình
  const uniqueServiceIds = new Set(
    plan.steps.flatMap((step) => step.serviceIds)
  );
  const includedServices = allServices.filter((service) =>
    uniqueServiceIds.has(service.id)
  );

  const thumbnailImages = [plan.imageUrl, ...(plan.imageUrls || [])].filter(
    (url): url is string => !!url
  );

  return (
    <div className="bg-background">
      <div className="container mx-auto py-8 md:py-12">
        {/* SECTION 1: HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {plan.name}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-3xl mx-auto">
            {plan.description}
          </p>
        </div>

        {/* SECTION 2: MAIN INFO & GALLERY */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
          {/* Cột thư viện ảnh */}
          <div>
            <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg shadow-lg border bg-white">
              <Image
                src={mainImage || "/images/product-placeholder.png"}
                alt={plan.name}
                fill
                className="object-cover transition-all duration-300"
              />
            </div>
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
                    alt={`${plan.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cột thông tin chi tiết */}
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Giá trọn gói</p>
                  <span className="font-bold text-4xl text-primary">
                    {new Intl.NumberFormat("vi-VN").format(plan.price)} VNĐ
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Tổng số</p>
                  <span className="font-bold text-4xl">
                    {plan.totalSessions} buổi
                  </span>
                </div>
              </div>
              <Button size="lg" asChild className="w-full">
                <Link href="/booking">Đặt Lịch Ngay</Link>
              </Button>
            </div>

            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-primary" /> Liệu trình
                này dành cho ai?
              </h3>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Những người có vấn đề về da cần cải thiện chuyên sâu.</li>
                <li>Khách hàng muốn theo một lộ trình điều trị nhất quán.</li>
                <li>Mong muốn đạt hiệu quả tối ưu với chi phí tiết kiệm.</li>
              </ul>
            </div>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-primary" /> Hiệu quả đạt
                được
              </h3>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Cải thiện rõ rệt tình trạng da sau toàn bộ liệu trình.</li>
                <li>Làn da khỏe mạnh, rạng rỡ và duy trì hiệu quả lâu dài.</li>
                <li>Phục hồi và tái tạo cấu trúc da từ sâu bên trong.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 3: INCLUDED SERVICES */}
        {includedServices.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">
                Bao gồm các dịch vụ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {includedServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 bg-card rounded-lg border flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={service.imageUrl}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {service.duration} phút
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-12" />

        {/* SECTION 4: TREATMENT STEPS */}
        <TreatmentSteps plan={plan} allServices={allServices} />
      </div>
    </div>
  );
}
