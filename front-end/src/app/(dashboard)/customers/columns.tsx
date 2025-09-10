"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FullCustomerProfile } from "@/features/customer/types";
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

interface GetColumnsProps {
  onUpdateStatus: (
    userId: string, // Cập nhật để truyền userId thay vì customerId cho status
    newStatus: "active" | "inactive"
  ) => void;
  onEdit: (customer: FullCustomerProfile) => void;
}

export const columns = ({
  onUpdateStatus,
  onEdit,
}: GetColumnsProps): ColumnDef<FullCustomerProfile>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Họ và tên",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <Link
          href={`/customers/${customer.id}`}
          className="font-medium text-primary hover:underline"
        >
          {customer.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastVisit",
    header: "Lần cuối đến",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastVisit"));
      return <div>{date.toLocaleDateString("vi-VN")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const isInactive = customer.status === "inactive";
      const actionText = isInactive ? "Kích hoạt lại" : "Vô hiệu hóa";

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
            <DropdownMenuItem onClick={() => onEdit(customer)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* SỬ DỤNG CONFIRMATION MODAL */}
            <ConfirmationModal
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className={
                    isInactive
                      ? "text-primary focus:text-primary"
                      : "text-destructive focus:text-destructive"
                  }
                >
                  {actionText}
                </DropdownMenuItem>
              }
              title={`Xác nhận ${actionText.toLowerCase()} tài khoản`}
              description={
                <>
                  Bạn có chắc chắn muốn {actionText.toLowerCase()} tài khoản của
                  khách hàng <strong>{customer.name}</strong>?
                </>
              }
              onConfirm={() =>
                onUpdateStatus(
                  customer.userId,
                  isInactive ? "active" : "inactive"
                )
              }
              isDestructive={!isInactive}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
