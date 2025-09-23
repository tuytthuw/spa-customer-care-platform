// src/features/booking/components/BookingSuccessStep.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, CalendarPlus, House, ArrowLeft } from "lucide-react";
import { Service } from "@/features/service/types";

interface BookingSuccessStepProps {
  bookingDetails: {
    service: Service | null;
    date: Date;
    time: string;
  };
  isReschedule?: boolean;
  redirectUrl?: string;
  redirectText?: string;
}

export default function BookingSuccessStep({
  bookingDetails,
  isReschedule = false,
  redirectUrl = "/",
  redirectText = "Quay về trang chủ",
}: BookingSuccessStepProps) {
  if (!bookingDetails.service) {
    // Thêm kiểm tra để tránh lỗi runtime
    return <div>Lỗi: Thông tin dịch vụ không hợp lệ.</div>;
  }
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
      <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10" />
      </div>
      <h2 className="text-2xl mb-4 text-foreground">
        {isReschedule
          ? "Thay đổi lịch hẹn thành công!"
          : "Đặt lịch thành công!"}
      </h2>
      <p className="text-muted-foreground mb-6">
        {isReschedule
          ? "Lịch hẹn của bạn đã được cập nhật. Chúng tôi đã gửi xác nhận chi tiết qua email của bạn."
          : "Cảm ơn bạn đã đặt lịch dịch vụ. Chúng tôi đã gửi xác nhận chi tiết qua email của bạn."}
      </p>
      <div className="bg-muted p-4 rounded-lg border border-border mb-6 max-w-md mx-auto">
        <div className="text-left">
          <p className="font-semibold">{bookingDetails.service?.name}</p>
          <p className="text-muted-foreground">
            Ngày: {bookingDetails.date.toLocaleDateString("vi-VN")}
          </p>
          <p className="text-muted-foreground">Giờ: {bookingDetails.time}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild variant="outline">
          <Link href={redirectUrl}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {redirectText}
          </Link>
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Thêm vào lịch
        </Button>
      </div>
    </div>
  );
}
