import ServiceCard from "@/features/service/components/service-card";
import { Button } from "@/components/ui/button";
import { Service } from "@/features/service/types";
import Link from "next/link";
import { getServices } from "@/features/service/api/service.api";

// hàm getFeaturedServices
const getFeaturedServices = async (): Promise<Service[]> => {
  const allServices = await getServices(); // Gọi hàm thật
  return allServices.slice(0, 3); // Lấy 3 dịch vụ đầu tiên
};
export default async function FeaturedServices() {
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
