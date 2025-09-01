// src/app/(public)/treatments/[id]/page.tsx

import { getTreatmentPlanById } from "@/features/treatment/api/treatment.api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PackageCheck, Tag } from "lucide-react";
import Link from "next/link";

// Props của trang sẽ chứa params với id của liệu trình
interface TreatmentPlanDetailPageProps {
  params: { id: string };
}

export default async function TreatmentPlanDetailPage({
  params,
}: TreatmentPlanDetailPageProps) {
  const { id } = params;
  console.log(
    `[SERVER LOG] Đang render trang chi tiết cho liệu trình ID: ${id}`
  );
  const plan = await getTreatmentPlanById(id);
  console.log(`[SERVER LOG] Kết quả từ API cho ID ${id}:`, plan);
  // Nếu không tìm thấy liệu trình, hiển thị trang 404
  if (!plan) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Cột hình ảnh */}
        <div>
          <Image
            src={plan.imageUrl}
            alt={plan.name}
            width={600}
            height={600}
            className="rounded-lg object-cover w-full shadow-lg"
          />
        </div>

        {/* Cột thông tin */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{plan.name}</h1>
          <p className="text-muted-foreground mb-6 text-lg">
            {plan.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="flex items-center text-lg">
              <PackageCheck className="mr-2 h-5 w-5 text-primary" />
              <span>Tổng số: {plan.totalSessions} buổi</span>
            </div>
            <div className="flex items-center text-lg">
              <Tag className="mr-2 h-5 w-5 text-primary" />
              <span className="font-semibold text-2xl">
                {new Intl.NumberFormat("vi-VN").format(plan.price)} VNĐ
              </span>
            </div>
          </div>

          <Button size="lg" asChild>
            <Link href="/booking">Đặt Lịch Ngay</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
