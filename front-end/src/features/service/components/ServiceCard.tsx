// src/components/screens/services/service-card.tsx
import { Service } from "@/features/service/types";
import DisplayCard from "@/components/common/DisplayCard";
import { Clock } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <DisplayCard
      href={`/services/${service.id}`}
      imageUrl={service.imageUrl}
      title={service.name}
      description={service.description}
      footerContent={
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{service.duration} phút</span>
          </div>
          <span className="text-lg font-semibold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(service.price)}
          </span>
        </div>
      }
    />
  );
}
