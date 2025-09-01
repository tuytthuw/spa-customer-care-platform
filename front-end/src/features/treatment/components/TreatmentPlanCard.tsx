import { TreatmentPlan } from "@/features/treatment/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageCheck, Tag } from "lucide-react";

interface TreatmentPlanCardProps {
  plan: TreatmentPlan;
}

export default function TreatmentPlanCard({ plan }: TreatmentPlanCardProps) {
  return (
    // Bọc card trong một Link để người dùng có thể nhấp vào xem chi tiết
    <Link href={`/treatment-plans/${plan.id}`} className="group flex">
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <Image
              src={plan.imageUrl}
              alt={plan.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow pt-6">
          <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
          <p className="text-muted-foreground text-sm line-clamp-3 h-[60px]">
            {plan.description}
          </p>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PackageCheck className="w-4 h-4" />
              <span>{plan.totalSessions} buổi</span>
            </div>
            <span className="text-lg font-semibold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(plan.price)}
            </span>
          </div>
          <Button className="w-full" asChild>
            {/* Dùng thẻ `<a>` bên trong Link để đảm bảo hoạt động đúng */}
            <a href={`/treatments/${plan.id}`}>Xem chi tiết</a>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
