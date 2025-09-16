import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, CalendarPlus, House } from "lucide-react";
import { Service } from "@/features/service/types";

interface BookingSuccessStepProps {
  bookingDetails: {
    service: Service | null;
    date: Date;
    time: string;
  };
}

export default function BookingSuccessStep({ bookingDetails }: BookingSuccessStepProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="text-3xl text-foreground" />
      </div>
      <h2 className="text-2xl mb-4 text-foreground">Đặt lịch thành công!</h2>
      <p className="text-muted-foreground mb-6">
        Cảm ơn bạn đã đặt lịch dịch vụ tại Serenity Spa. Chúng tôi đã gửi xác
        nhận chi tiết qua email của bạn.
      </p>
      <div className="bg-muted p-4 rounded-lg border border-border mb-6 max-w-md mx-auto">
        <div className="text-left">
          <p>{bookingDetails.service?.name}</p>
          <p className="text-muted-foreground">
            Ngày: {bookingDetails.date.toLocaleDateString("vi-VN")}
          </p>
          <p className="text-muted-foreground">Giờ: {bookingDetails.time}</p>
          <p className="text-foreground mt-2">Mã đặt lịch: #SPA25081120</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Thêm vào lịch
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <House className="mr-2 h-4 w-4" />
            Quay về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
}
