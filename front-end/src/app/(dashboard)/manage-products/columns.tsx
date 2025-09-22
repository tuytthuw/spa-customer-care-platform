// src/app/(dashboard)/manage-products/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/features/product/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ConfirmationModal } from "@/components/common/ConfirmationModal"; // Import component mới
import { cn } from "@/lib/utils";
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const LOW_STOCK_THRESHOLD = 10;

interface GetColumnsProps {
  onEdit: (product: Product) => void;
  onUpdateStatus: (productId: string, newStatus: "active" | "inactive") => void;
}

export const columns = ({
  onEdit,
  onUpdateStatus,
}: GetColumnsProps): ColumnDef<Product>[] => [
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
    // === THAY ĐỔI LOGIC HIỂN THỊ TỒN KHO TẠI ĐÂY ===
    cell: ({ row }) => {
      const stock = row.original.stock;
      const isLowStock = stock <= LOW_STOCK_THRESHOLD;

      return (
        <div
          className={cn("flex items-center gap-2", {
            "text-warning": isLowStock, // SỬ DỤNG MÀU TỪ THEME
          })}
        >
          {isLowStock && <AlertTriangle className="h-4 w-4" />}
          <span>{stock}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "secondary"}
      >
        {row.original.status === "active" ? "Đang hoạt động" : "Tạm ẩn"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const isInactive = product.status === "inactive";
      const actionText = isInactive ? "Kích hoạt" : "Vô hiệu hóa";

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
            <DropdownMenuItem onClick={() => onEdit(product)}>
              Sửa thông tin
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <ConfirmationModal
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()} // Ngăn dropdown tự đóng
                  className="text-destructive focus:text-destructive"
                >
                  {actionText}
                </DropdownMenuItem>
              }
              title={`Xác nhận ${actionText.toLowerCase()} sản phẩm`}
              description={
                <>
                  Hành động này sẽ thay đổi trạng thái của sản phẩm{" "}
                  <strong>{product.name}</strong>.
                </>
              }
              onConfirm={() =>
                onUpdateStatus(product.id, isInactive ? "active" : "inactive")
              }
              isDestructive={!isInactive} // Hành động "Vô hiệu hóa" là destructive
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
