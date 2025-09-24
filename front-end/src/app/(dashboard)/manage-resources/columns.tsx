"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Resource } from "@/features/resource/types";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";

// ✅ Mới: Thêm props cho hàm columns
interface GetColumnsProps {
  onEdit: (resource: Resource) => void;
}

export const columns = ({ onEdit }: GetColumnsProps): ColumnDef<Resource>[] => [
  {
    accessorKey: "name",
    header: "Tên tài nguyên",
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const type = row.original.type;
      return <span>{type === "room" ? "Phòng/Giường" : "Thiết bị"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "available"
          ? "default"
          : status === "maintenance"
          ? "destructive"
          : "secondary";
      const text =
        status === "available"
          ? "Sẵn sàng"
          : status === "maintenance"
          ? "Bảo trì"
          : "Đang sử dụng";
      return <Badge variant={variant}>{text}</Badge>;
    },
  },
  {
    accessorKey: "notes",
    header: "Ghi chú",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const resource = row.original; // Lấy thông tin của dòng hiện tại
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              {/* ✅ THAY ĐỔI: Thêm onClick handler */}
              <DropdownMenuItem onClick={() => onEdit(resource)}>
                Sửa thông tin
              </DropdownMenuItem>
              <DropdownMenuItem>Xem lịch sử sử dụng</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Báo bảo trì
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
