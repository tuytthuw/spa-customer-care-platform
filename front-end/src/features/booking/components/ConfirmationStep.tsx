"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createAppointment } from "@/features/appointment/api/appointment.api";
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
  onConfirm: () => void;
}

export default function ConfirmationStep({
  bookingDetails,
  onPrevStep,
  onConfirm,
}: ConfirmationStepProps) {
  const { user } = useAuth();
  const { service, date, time } = bookingDetails;

  // State để quản lý thông tin form
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [note, setNote] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      // Không cần toast ở đây vì onConfirm sẽ xử lý
      onConfirm(); // Chuyển sang bước thành công
    },
    onError: (error) => {
      toast.error(`Đặt lịch thất bại: ${error.message}`);
    },
  });

  if (!service) {
    return <div>Lỗi: Không có thông tin dịch vụ. Vui lòng quay lại.</div>;
  }

  const handleConfirmClick = () => {
    if (!name || !phone || !email) {
      toast.error("Vui lòng điền đầy đủ họ tên, số điện thoại và email.");
      return;
    }
    if (!termsAccepted) {
      toast.error("Bạn phải đồng ý với điều khoản dịch vụ.");
      return;
    }

    // Kết hợp ngày và giờ thành một đối tượng Date hoàn chỉnh
    const [hours, minutes] = time.split(":").map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    createAppointmentMutation.mutate({
      // Trong thực tế, customerId sẽ được lấy từ user đang đăng nhập
      // hoặc tạo mới nếu là khách vãng lai.
      customerId: user ? user.id : "guest-user",
      serviceId: service.id,
      date: appointmentDate.toISOString(),
      // Ghi chú và các thông tin khác có thể được thêm vào đây
    });
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nhập họ và tên"
                className="mt-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createAppointmentMutation.isPending}
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                className="mt-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={createAppointmentMutation.isPending}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                className="mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={createAppointmentMutation.isPending}
              />
            </div>
            <div>
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                placeholder="Nhập ghi chú nếu có"
                className="mt-2 h-24"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={createAppointmentMutation.isPending}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              disabled={createAppointmentMutation.isPending}
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
          disabled={createAppointmentMutation.isPending}
        >
          {createAppointmentMutation.isPending
            ? "Đang xử lý..."
            : "Xác nhận đặt lịch"}
        </Button>
      </div>
    </div>
  );
}
