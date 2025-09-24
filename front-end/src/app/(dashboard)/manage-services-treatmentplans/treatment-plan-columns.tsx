"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/features/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { TreatmentPlan } from "@/features/treatment/types";
import { ConfirmationModal } from "@/features/shared/components/common/ConfirmationModal";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

interface GetColumnsProps {
  onEdit: (plan: TreatmentPlan) => void;
  onUpdateStatus: (planId: string, newStatus: "active" | "inactive") => void;
}

export const treatmentPlanColumns = ({
  onEdit,
  onUpdateStatus,
}: GetColumnsProps): ColumnDef<TreatmentPlan>[] => [
  {
    accessorKey: "name",
    header: "Tên Liệu trình",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Image
          src={row.original.imageUrl || "/images/product-placeholder.png"}
          alt={row.original.name}
          width={40}
          height={40}
          className="rounded-md object-cover"
        />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "categories",
    header: "Danh mục",
    cell: ({ row }) => {
      const categories = row.original.categories;
      return (
        <span>{Array.isArray(categories) ? categories.join(", ") : ""}</span>
      );
    },
  },

  {
    accessorKey: "price",
    header: "Giá bán",
    cell: ({ row }) => formatCurrency(row.original.price),
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
      const plan = row.original;
      const isInactive = plan.status === "inactive";
      const actionText = isInactive ? "Hiện lại" : "Tạm ẩn";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(plan)}>
              Sửa thông tin
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* SỬ DỤNG CONFIRMATION MODAL */}
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
              title={`Xác nhận ${actionText.toLowerCase()} liệu trình`}
              description={
                <>
                  Hành động này sẽ thay đổi trạng thái của liệu trình{" "}
                  <strong>{plan.name}</strong>.
                </>
              }
              onConfirm={() =>
                onUpdateStatus(plan.id, isInactive ? "active" : "inactive")
              }
              isDestructive={!isInactive}
              confirmText="Xác nhận"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
