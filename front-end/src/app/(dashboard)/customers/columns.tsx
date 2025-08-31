"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/features/customer/types";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
              <DropdownMenuItem onClick={() => onEdit(customer)}>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className={cn(
                    isInactive
                      ? "text-primary focus:text-primary"
                      : "text-destructive focus:text-destructive"
                  )}
                >
                  {isInactive ? "Kích hoạt lại" : "Vô hiệu hóa"}
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này sẽ thay đổi trạng thái tài khoản của khách hàng{" "}
                <span className="font-medium">{customer.name}</span>.
                {isInactive
                  ? " Khách hàng này sẽ có thể đăng nhập và đặt lịch trở lại."
                  : " Khách hàng này sẽ không thể đăng nhập hoặc đặt lịch mới."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  onUpdateStatus(
                    customer.userId, // Truyền userId để cập nhật đúng user
                    isInactive ? "active" : "inactive"
                  )
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
