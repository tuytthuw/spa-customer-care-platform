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
import Image from "next/image"; // 1. Import component Image

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
    // 2. Thêm hàm `cell` để tùy chỉnh cách hiển thị
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex items-center gap-4">
          <Image
            src={service.imageUrl || "/images/product-placeholder.png"}
            alt={service.name}
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <span className="font-medium">{service.name}</span>
        </div>
      );
    },
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
