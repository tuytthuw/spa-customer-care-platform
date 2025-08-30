import { Appointment } from "@/features/appointment/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// Sửa lại import để dùng dữ liệu có sẵn
import { mockServices, mockStaff } from "@/lib/mock-data";

interface ReviewCardProps {
  appointment: Appointment;
  onWriteReview: () => void;
}

const ReviewCard = ({ appointment, onWriteReview }: ReviewCardProps) => {
  // Tìm thông tin service và staff dựa trên ID
  const service = mockServices.find((s) => s.id === appointment.serviceId);
  const staff = mockStaff.find((s) => s.id === appointment.technicianId);

  // Xử lý trường hợp không tìm thấy
  if (!service) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dịch vụ không tồn tại</CardTitle>
        </CardHeader>
      </Card>
    );
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
              <strong>{staff ? staff.name : "Chưa xác định"}</strong>
            </p>
            <p>
              Ngày:{" "}
              <strong>
                {new Date(appointment.date).toLocaleDateString("vi-VN")}
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

export default ReviewCard;
