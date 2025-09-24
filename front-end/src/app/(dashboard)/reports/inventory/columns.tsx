// src/app/(dashboard)/reports/inventory/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/features/product/types";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const LOW_STOCK_THRESHOLD = 10;

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Tên sản phẩm",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={row.original.imageUrl || "/images/placeholder.png"}
          alt={row.original.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "stock",
    header: "Tồn kho Hiện tại",
    cell: ({ row }) => {
      const product = row.original;
      const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;

      return (
        <div
          className={cn("flex items-center gap-2 font-semibold", {
            "text-destructive": isLowStock,
          })}
        >
          {isLowStock && <AlertTriangle className="h-4 w-4" />}
          <span>{`${product.stock.toLocaleString("vi-VN")} ${
            product.baseUnit
          }`}</span>
        </div>
      );
    },
  },
  {
    header: "Loại sản phẩm",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex gap-2">
          {product.isRetail && <Badge variant="outline">Bán lẻ</Badge>}
          {product.isConsumable && <Badge variant="secondary">Tiêu hao</Badge>}
        </div>
      );
    },
  },
  {
    header: "Giá trị Tồn kho",
    cell: ({ row }) => {
      const product = row.original;
      if (
        !product.isRetail ||
        !product.conversionRate ||
        product.conversionRate <= 0
      ) {
        return <span className="text-muted-foreground">N/A</span>;
      }
      const retailStock = product.stock / product.conversionRate;
      const value = retailStock * product.price;

      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
  },
];
