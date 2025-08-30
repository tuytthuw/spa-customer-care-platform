import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Check, MoreVertical } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case "waiting":
      return { text: "Đang chờ", className: "bg-muted text-foreground" };
    case "in_service":
      return {
        text: "Đang phục vụ",
        className: "bg-primary text-primary-foreground",
      };
    case "completed":
      return {
        text: "Đã hoàn tất",
        className: "bg-card border border-border text-foreground",
      };
    default:
      return { text: "Không xác định", className: "bg-muted text-foreground" };
  }
};

export default function CustomerCard({ customer }: CustomerCardProps) {
  // Giả lập dữ liệu lịch hẹn cho khách hàng
  const statusInfo = getStatusInfo("waiting");
  const service = mockServices[0];
  const staff = mockStaff[0];

  return (
    <div className="bg-card p-4 rounded border border-border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Image
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${customer.id}`}
            alt="Avatar"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <h4>{customer.name}</h4>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-sm ${statusInfo.className}`}>
          {statusInfo.text}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Dịch vụ:</span>
          <span>{service.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Thời gian:</span>
          <span>9:00 - 10:00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Nhân viên:</span>
          <span>{staff.name}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button className="flex-1 bg-primary text-primary-foreground py-2 px-3 rounded text-sm">
          <Check className="mr-1 h-4 w-4" />
          Check-in
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="px-3 py-2 border border-border rounded text-sm"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
