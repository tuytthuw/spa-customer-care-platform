// src/features/landing/components/FeaturedServices.tsx

import ServiceCard from "@/features/service/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Service } from "@/features/service/types";
import Link from "next/link";
import { getServices } from "@/features/service/api/service.api";

// 1. Chuyển hàm lấy dữ liệu vào trong file component
const getFeaturedServices = async (): Promise<Service[]> => {
  const allServices = await getServices();
  // Lấy 3 dịch vụ đầu tiên làm dịch vụ nổi bật
  return allServices.slice(0, 3);
};

// 2. Thêm "async" để biến đây thành một Server Component
export default async function FeaturedServices() {
  // 3. Gọi trực tiếp hàm lấy dữ liệu
  const featuredServices = await getFeaturedServices();

  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Dịch Vụ Nổi Bật</h2>
          <p className="text-muted-foreground mt-2">
            Những liệu trình được khách hàng yêu thích và lựa chọn nhiều nhất.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/services">Xem Tất Cả Dịch Vụ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
