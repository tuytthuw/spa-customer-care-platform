"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/features/billing/types";
import { Button } from "@/features/shared/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

interface GetColumnsProps {
  onViewDetails: (invoice: Invoice) => void;
}

export const columns = ({
  onViewDetails,
}: GetColumnsProps): ColumnDef<Invoice>[] => [
  {
    accessorKey: "id",
    header: "Mã HĐ",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày tạo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <div>{date.toLocaleDateString("vi-VN")}</div>;
    },
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Tổng tiền</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.original.total)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(invoice)}
          >
            Xem chi tiết
          </Button>
        </div>
      );
    },
  },
];
