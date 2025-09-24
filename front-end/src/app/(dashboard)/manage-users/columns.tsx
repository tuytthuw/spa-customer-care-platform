"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/features/user/types";
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
import { Badge } from "@/features/shared/components/ui/badge";
import { ConfirmationModal } from "@/features/shared/components/common/ConfirmationModal";

interface GetColumnsProps {
  onUpdateStatus: (userId: string, newStatus: "active" | "inactive") => void;
}

export const columns = ({
  onUpdateStatus,
}: GetColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const role = row.original.role;
      const roleText = {
        customer: "Khách hàng",
        technician: "Kỹ thuật viên",
        receptionist: "Lễ tân",
        manager: "Quản lý",
      }[role];
      return <span className="capitalize">{roleText}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái tài khoản",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status === "active" ? "Đang hoạt động" : "Vô hiệu hóa"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const isInactive = user.status === "inactive";
      const actionText = isInactive ? "Kích hoạt lại" : "Vô hiệu hóa";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem>Đặt lại mật khẩu (sắp có)</DropdownMenuItem>
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
                  Hành động này sẽ thay đổi trạng thái tài khoản của{" "}
                  <strong>{user.email}</strong>.
                </>
              }
              onConfirm={() =>
                onUpdateStatus(user.id, isInactive ? "active" : "inactive")
              }
              isDestructive={!isInactive}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
