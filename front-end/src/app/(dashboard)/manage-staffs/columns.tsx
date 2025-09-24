"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FullStaffProfile } from "@/features/staff/types";
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
  onEdit: (staff: FullStaffProfile) => void;
  onUpdateStatus: (staffId: string, newStatus: "active" | "inactive") => void;
}

export const columns = ({
  onEdit,
  onUpdateStatus,
}: GetColumnsProps): ColumnDef<FullStaffProfile>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Họ và tên",
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
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const roleText =
        {
          technician: "Kỹ thuật viên",
          receptionist: "Lễ tân",
          manager: "Quản lý",
        }[role] || "Không xác định";
      return <span>{roleText}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status === "active" ? "Đang hoạt động" : "Tạm nghỉ"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const staff = row.original;
      const isInactive = staff.status === "inactive";
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
            <DropdownMenuItem onClick={() => onEdit(staff)}>
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
              title={`Xác nhận ${actionText.toLowerCase()} nhân viên`}
              description={
                <>
                  Hành động này sẽ thay đổi trạng thái của nhân viên{" "}
                  <strong>{staff.name}</strong>.
                </>
              }
              onConfirm={() =>
                onUpdateStatus(staff.id, isInactive ? "active" : "inactive")
              }
              isDestructive={!isInactive}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
