import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, CalendarPlus, House } from "lucide-react";

export default function BookingSuccessStep({ bookingDetails }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="text-3xl text-neutral-800" />
      </div>
      <h2 className="text-2xl mb-4 text-neutral-800">Đặt lịch thành công!</h2>
      <p className="text-neutral-600 mb-6">
        Cảm ơn bạn đã đặt lịch dịch vụ tại Serenity Spa. Chúng tôi đã gửi xác
        nhận chi tiết qua email của bạn.
      </p>
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-6 max-w-md mx-auto">
        <div className="text-left">
          <p>{bookingDetails.service?.name}</p>
          <p className="text-neutral-600">
            Ngày: {bookingDetails.date.toLocaleDateString("vi-VN")}
          </p>
          <p className="text-neutral-600">Giờ: {bookingDetails.time}</p>
          <p className="text-neutral-800 mt-2">Mã đặt lịch: #SPA25081120</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button className="bg-neutral-800 text-white hover:bg-neutral-700">
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
