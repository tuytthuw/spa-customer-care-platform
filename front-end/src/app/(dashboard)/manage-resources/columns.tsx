"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Resource } from "@/features/resource/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Resource>[] = [
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
              <DropdownMenuItem>Sửa thông tin</DropdownMenuItem>
              <DropdownMenuItem>Xem lịch sử dụng</DropdownMenuItem>
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
