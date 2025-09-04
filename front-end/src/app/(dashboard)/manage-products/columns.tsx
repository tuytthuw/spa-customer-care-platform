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
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

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
      return (
        <AlertDialog>
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
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  {isInactive ? "Kích hoạt" : "Vô hiệu hóa"}
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Xác nhận {isInactive ? "kích hoạt" : "vô hiệu hóa"} sản phẩm
              </AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này sẽ thay đổi trạng thái của sản phẩm {product.name}
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  onUpdateStatus(product.id, isInactive ? "active" : "inactive")
                }
              >
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
