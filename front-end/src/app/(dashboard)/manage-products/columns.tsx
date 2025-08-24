"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/product"; // Đảm bảo bạn đã có type này
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Tên sản phẩm",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-4">
          <Image
            src={product.imageUrl || "/images/product-placeholder.png"}
            alt={product.name}
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <span className="font-medium">{product.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Giá bán",
    cell: ({ row }) => formatCurrency(row.original.price),
  },
  {
    accessorKey: "stock",
    header: "Tồn kho",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Sao chép ID
            </DropdownMenuItem>
            <DropdownMenuItem>Sửa thông tin</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Xóa sản phẩm
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
