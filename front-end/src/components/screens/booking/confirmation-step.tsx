"use client";

import { Button } from "@/components/ui/button";
import { mockServices } from "@/lib/mock-data";
import { mockTechnicians } from "@/lib/mock-data";

// Kiểu dữ liệu cho props, bao gồm tất cả thông tin đã chọn
interface ConfirmationStepProps {
  bookingDetails: {
    serviceId: string | null;
    date: Date;
    time: string;
    technicianId?: string;
  };
  onPrevStep: () => void;
  onConfirm: () => void;
}

export default function ConfirmationStep({
  bookingDetails,
  onPrevStep,
  onConfirm,
}: ConfirmationStepProps) {
  // Tìm thông tin chi tiết từ dữ liệu giả
  const service = mockServices.find((s) => s.id === bookingDetails.serviceId);
  const technician = mockTechnicians.find(
    (t) => t.id === bookingDetails.technicianId
  );

  if (!service) {
    return <div>Lỗi: Không tìm thấy dịch vụ. Vui lòng thử lại.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        3. Xác nhận thông tin lịch hẹn
      </h2>
      <div className="space-y-4 p-4 border rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">Dịch vụ</p>
          <p className="font-medium">{service.name}</p>
        </div>
        <hr />
        <div>
          <p className="text-sm text-muted-foreground">Thời gian</p>
          <p className="font-medium">
            {bookingDetails.time},{" "}
            {bookingDetails.date.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <hr />
        <div>
          <p className="text-sm text-muted-foreground">Kỹ thuật viên</p>
          <p className="font-medium">
            {technician ? technician.name : "Hệ thống tự sắp xếp"}
          </p>
        </div>
        <hr />
        <div>
          <p className="text-sm text-muted-foreground">Tổng chi phí</p>
          <p className="font-bold text-lg text-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(service.price)}
          </p>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>
          Quay lại
        </Button>
        <Button onClick={onConfirm}>Xác nhận Đặt lịch</Button>
      </div>
    </div>
  );
}
