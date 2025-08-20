// src/app/services/page.tsx
import { mockServices } from "@/lib/mock-data";
import { Service } from "@/types/service";
import ServiceCard from "@/components/screens/services/service-card";
import { Input } from "@/components/ui/input";

// Mô phỏng việc gọi API
const getServices = async (): Promise<Service[]> => {
  // Trong tương lai, bạn sẽ thay thế dòng này bằng lệnh fetch tới API backend
  return Promise.resolve(mockServices);
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Khám Phá Dịch Vụ Của Chúng Tôi
        </h1>
        <p className="text-muted-foreground mt-2">
          Tìm kiếm liệu trình hoàn hảo dành cho bạn
        </p>
      </header>

      <div className="mb-8 max-w-md mx-auto">
        <Input
          type="search"
          placeholder="Tìm kiếm dịch vụ (ví dụ: massage, chăm sóc da...)"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
