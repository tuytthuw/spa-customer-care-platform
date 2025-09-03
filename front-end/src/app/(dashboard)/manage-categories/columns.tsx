// src/app/(dashboard)/manage-categories/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/features/category/types";
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

interface GetColumnsProps {
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export const columns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: "Tên danh mục",
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const type = row.original.type;
      const typeText =
        {
          service: "Dịch vụ",
          product: "Sản phẩm",
          treatment: "Liệu trình",
        }[type] || "Không xác định";
      return <Badge variant="secondary">{typeText}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(category)}>
                Sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(category.id)}
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
