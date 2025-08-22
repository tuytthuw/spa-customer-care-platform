"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ArrowLeft, CalendarDays } from "lucide-react";

export default function ConfirmationStep({
  bookingDetails,
  onPrevStep,
  onConfirm,
}: any) {
  const { service, date, time } = bookingDetails;

  if (!service) {
    return <div>Lỗi: Không có thông tin dịch vụ. Vui lòng quay lại.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={onPrevStep}
          className="text-neutral-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại chọn thời gian
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-2xl mb-6 text-neutral-800">Xác nhận đặt lịch</h2>

        {/* Service Details */}
        <div className="mb-8">
          <h3 className="text-lg mb-4">Chi tiết dịch vụ</h3>
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
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
                <p className="text-neutral-600 mb-1">
                  Thời gian: {service.duration} phút
                </p>
                <p className="text-neutral-800">
                  Giá: {new Intl.NumberFormat("vi-VN").format(service.price)}{" "}
                  VNĐ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Time */}
        <div className="mb-8">
          <h3 className="text-lg mb-4">Thời gian đã chọn</h3>
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center">
              <CalendarDays className="text-neutral-600 text-xl mr-3" />
              <div>
                <p>Ngày: {date.toLocaleDateString("vi-VN")}</p>
                <p>Giờ: {time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
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
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                placeholder="Nhập ghi chú nếu có"
                className="mt-2 h-24"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="ml-2 text-neutral-700 text-sm">
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
          onClick={onConfirm}
          className="w-full py-3 bg-neutral-800 text-white hover:bg-neutral-700"
        >
          Xác nhận đặt lịch
        </Button>
      </div>
    </div>
  );
}
