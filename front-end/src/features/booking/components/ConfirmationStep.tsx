"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ArrowLeft, CalendarDays, UserCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContexts";
import { Service } from "@/features/service/types";

interface ConfirmationStepProps {
  bookingDetails: {
    service: Service | null;
    date: Date;
    time: string;
  };
  onPrevStep: () => void;
  onConfirm: (customerInfo: {
    name: string;
    phone: string;
    email: string;
    note: string;
  }) => void;
  isSubmitting?: boolean;
  isPrePurchased?: boolean;
}

export default function ConfirmationStep({
  bookingDetails,
  onPrevStep,
  onConfirm,
  isSubmitting = false,
  isPrePurchased = false,
}: ConfirmationStepProps) {
  const { user } = useAuth();
  const { service, date, time } = bookingDetails;

  // Hợp nhất state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    note: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (!service) {
    return <div>Lỗi: Không có thông tin dịch vụ. Vui lòng quay lại.</div>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleConfirmClick = () => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Vui lòng điền đầy đủ họ tên, số điện thoại và email.");
      return;
    }
    if (!termsAccepted) {
      toast.error("Bạn phải đồng ý với điều khoản dịch vụ.");
      return;
    }
    // ✅ Truyền toàn bộ thông tin đã được xác thực lên component cha
    onConfirm(formData);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={onPrevStep}
          className="text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại chọn thời gian
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <h2 className="text-2xl mb-6 text-foreground">Xác nhận đặt lịch</h2>

        {/* Chi tiết dịch vụ */}
        <div className="mb-8">
          <h3 className="text-lg mb-4">Chi tiết dịch vụ</h3>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <div className="flex items-start">
              <div className="relative h-24 w-24 rounded-md mr-4 overflow-hidden">
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div>
                <h4 className="text-lg">{service.name}</h4>
                <p className="text-muted-foreground mb-1">
                  Thời gian: {service.duration} phút
                </p>
                <p className="text-foreground">
                  Giá: {new Intl.NumberFormat("vi-VN").format(service.price)}{" "}
                  VNĐ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thời gian đã chọn */}
        <div className="mb-8">
          <h3 className="text-lg mb-4">Thời gian đã chọn</h3>
          <div className="bg-muted p-4 rounded-lg border border-border">
            <div className="flex items-center">
              <CalendarDays className="text-muted-foreground text-xl mr-3" />
              <div>
                <p>Ngày: {date.toLocaleDateString("vi-VN")}</p>
                <p>Giờ: {time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <div className="mb-8">
          <h3 className="text-lg mb-4">Thông tin khách hàng</h3>
          {isPrePurchased ? (
            <div className="p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
              <p className="font-semibold">
                Bạn đang sử dụng một lượt dịch vụ đã mua trước.
              </p>
              <p className="text-sm">Lịch hẹn này đã được thanh toán.</p>
            </div>
          ) : user ? (
            <div className="bg-muted p-4 rounded-lg border border-border">
              <div className="flex items-center">
                <UserCircle className="text-muted-foreground text-xl mr-3" />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.email} - {user.phone}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="mt-2"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="mt-2"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  className="mt-2"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
          <Textarea
            id="note"
            placeholder="Nhập ghi chú nếu có"
            className="mt-2 h-24"
            value={formData.note}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="mt-4 mb-4">
          <div className="flex items-center">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="terms" className="ml-2 text-foreground text-sm">
              Tôi đồng ý với{" "}
              <span className="underline cursor-pointer">
                điều khoản dịch vụ
              </span>{" "}
              và{" "}
              <span className="underline cursor-pointer">
                chính sách bảo mật
              </span>
            </label>
          </div>
        </div>

        <Button
          onClick={handleConfirmClick}
          className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Đang xử lý..."
            : isPrePurchased
            ? "Xác nhận sử dụng dịch vụ"
            : "Xác nhận & Thanh toán"}
        </Button>
      </div>
    </div>
  );
}
