import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/features/service/api/service.api";
import { Service } from "@/features/service/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Clock, Tag } from "lucide-react";

interface ServiceSelectionStepProps {
  onServiceSelect: (service: Service) => void;
}

export default function ServiceSelectionStep({
  onServiceSelect,
}: ServiceSelectionStepProps) {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: getServices,
  });

  if (isLoading) {
    return <div>Đang tải danh sách dịch vụ...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-6 text-foreground">Chọn dịch vụ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={service.imageUrl}
                alt={service.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg mb-2">{service.name}</h3>
              <div className="flex items-center mb-2 text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>{service.duration} phút</span>
              </div>
              <div className="flex items-center mb-4">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  {new Intl.NumberFormat("vi-VN").format(service.price)} VNĐ
                </span>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => onServiceSelect(service)}
              >
                Chọn
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
