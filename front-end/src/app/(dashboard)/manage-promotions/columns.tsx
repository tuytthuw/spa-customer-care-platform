"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Promotion } from "@/features/promotion/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { cn } from "@/lib/utils";

interface GetColumnsProps {
  onEdit: (promotion: Promotion) => void;
  onUpdateStatus: (promotionId: string, status: "active" | "inactive") => void;
}

export const columns = ({
  onEdit,
  onUpdateStatus,
}: GetColumnsProps): ColumnDef<Promotion>[] => [
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "discountPercent",
    header: "Giảm giá (%)",
    cell: ({ row }) => `${row.original.discountPercent}%`,
  },
  {
    accessorKey: "startDate",
    header: "Ngày bắt đầu",
    cell: ({ row }) =>
      new Date(row.original.startDate).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "endDate",
    header: "Ngày kết thúc",
    cell: ({ row }) =>
      new Date(row.original.endDate).toLocaleDateString("vi-VN"),
  },
  {
    header: "Trạng thái",
    cell: ({ row }) => {
      const today = new Date();
      const startDate = new Date(row.original.startDate);
      const endDate = new Date(row.original.endDate);
      const isActive = today >= startDate && today <= endDate;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Đang diễn ra" : "Đã/Chưa diễn ra"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const promotion = row.original;
      const isInactive = promotion.status === "inactive";
      const actionText = isInactive ? "Kích hoạt" : "Ẩn";

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(promotion)}>
                Sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmationModal
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className={cn(
                      isInactive
                        ? "text-primary focus:text-primary"
                        : "text-destructive focus:text-destructive"
                    )}
                  >
                    {actionText}
                  </DropdownMenuItem>
                }
                title={`Xác nhận ${actionText.toLowerCase()} khuyến mãi?`}
                description={
                  <>
                    Bạn có chắc chắn muốn {actionText.toLowerCase()} chương
                    trình <strong>{promotion.title}</strong>?
                  </>
                }
                onConfirm={() =>
                  onUpdateStatus(
                    promotion.id,
                    isInactive ? "active" : "inactive"
                  )
                }
                confirmText={`Đúng, ${actionText}`}
                isDestructive={!isInactive}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
