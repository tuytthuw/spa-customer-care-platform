import { Appointment } from "@/features/appointment/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import Image from "next/image";

interface ReviewCardProps {
  appointment: Appointment;
  services: Service[];
  staff: Staff[];
  onWriteReview: () => void;
}

const SerViceReviewCard = ({
  appointment,
  services,
  staff,
  onWriteReview,
}: ReviewCardProps) => {
  const service = services.find((s) => s.id === appointment.serviceId);
  const staffMember = staff.find((s) => s.id === appointment.technicianId);

  if (!service) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
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
              Kỹ thuật viên:{" "}
              <strong>
                {staffMember ? staffMember.name : "Chưa xác định"}
              </strong>
            </p>
            <p>
              Ngày:{" "}
              <strong>
                {new Date(appointment.start).toLocaleDateString("vi-VN")}
              </strong>
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

export default SerViceReviewCard;
