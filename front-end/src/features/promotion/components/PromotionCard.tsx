import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Promotion } from "../types";

interface PromotionCardProps {
  promotion: Promotion;
}

export const PromotionCard = ({ promotion }: PromotionCardProps) => {
  const isExpired = new Date(promotion.endDate) < new Date();

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0 relative">
        <Image
          src={promotion.imageUrl}
          alt={promotion.title}
          width={400}
          height={200}
          className="object-cover w-full h-48"
        />
        {isExpired && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-lg font-bold">Hết hạn</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <CardTitle className="mb-2 text-xl">{promotion.title}</CardTitle>
        <p className="text-muted-foreground text-sm flex-grow">
          {promotion.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground mt-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {`Áp dụng từ ${new Date(promotion.startDate).toLocaleDateString(
              "vi-VN"
            )} đến ${new Date(promotion.endDate).toLocaleDateString("vi-VN")}`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
