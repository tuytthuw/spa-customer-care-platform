"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TreatmentPlan } from "@/types/treatmentPlan";
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

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const treatmentPlanColumns: ColumnDef<TreatmentPlan>[] = [
  {
    accessorKey: "name",
    header: "Tên Liệu trình",
    cell: ({ row }) => {
      const plan = row.original;
      return (
        <div className="flex items-center gap-4">
          <Image
            src={plan.imageUrl}
            alt={plan.name}
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <span className="font-medium">{plan.name}</span>
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
    accessorKey: "totalSessions",
    header: "Số buổi",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem>Sửa thông tin</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            Xóa liệu trình
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
