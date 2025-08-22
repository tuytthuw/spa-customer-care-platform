"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Service } from "@/types/service";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: "Tên dịch vụ",
  },
  {
    accessorKey: "category",
    header: "Danh mục",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Giá</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return (
        <div className="text-right font-medium">{formatCurrency(price)}</div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-center">Thời lượng (phút)</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("duration")}</div>
    ),
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
              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
