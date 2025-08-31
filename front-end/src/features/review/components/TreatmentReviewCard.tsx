import { TreatmentPackage } from "@/features/treatment/types";
import { Service } from "@/features/service/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface TreatmentReviewCardProps {
  treatmentPackage: TreatmentPackage;
  services: Service[];
  onWriteReview: () => void;
}

const TreatmentReviewCard = ({
  treatmentPackage,
  services,
  onWriteReview,
}: TreatmentReviewCardProps) => {
  const service = services.find((s) => s.id === treatmentPackage.serviceId);

  if (!service) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>
          Liệu trình {treatmentPackage.totalSessions} buổi
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="col-span-1">
          <Image
            src={service.imageUrl}
            alt={service.name}
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <p>
              Ngày mua:{" "}
              <strong>
                {new Date(treatmentPackage.purchaseDate).toLocaleDateString(
                  "vi-VN"
                )}
              </strong>
            </p>
            <p>
              Trạng thái: <strong>Đã hoàn thành</strong>
            </p>
          </div>
          <Button onClick={onWriteReview} className="mt-4 md:mt-0">
            Viết đánh giá
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TreatmentReviewCard;
