// src/app/services/[id]/page.tsx
import { mockServices } from "@/lib/mock-data";
import { Service } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Clock, Tag } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link"; // Import Link

// Mô phỏng việc gọi API để lấy 1 dịch vụ theo ID
const getServiceById = async (id: string): Promise<Service | undefined> => {
  // Thay thế bằng fetch tới API: /api/services/${id}
  return Promise.resolve(mockServices.find((s) => s.id === id));
};

interface ServiceDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const service = await getServiceById(params.id);

  // Nếu không tìm thấy service, hiển thị trang 404
  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Cột hình ảnh */}
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Cột thông tin */}
        <div className="flex flex-col justify-center">
          <p className="text-primary font-semibold mb-2">{service.category}</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {service.name}
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            {service.description}
          </p>

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{service.duration} phút</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(service.price)}
              </span>
            </div>
          </div>

          <Link href={`/booking?serviceId=${service.id}`}>
            <Button size="lg" className="w-full sm:w-auto">
              Đặt Lịch Ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
