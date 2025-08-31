"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FullStaffProfile } from "@/features/staff/types";
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
import { cn } from "@/lib/utils";

// 1. Cập nhật props để nhận cả hai hàm
interface GetColumnsProps {
  onEdit: (staff: FullStaffProfile) => void;
  onUpdateStatus: (staffId: string, newStatus: "active" | "inactive") => void;
}

export const columns = ({
  onEdit,
  onUpdateStatus,
}: GetColumnsProps): ColumnDef<FullStaffProfile>[] => [
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

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              {/* 2. Thêm onClick cho nút Chỉnh sửa */}
              <DropdownMenuItem onClick={() => onEdit(staff)}>
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
                Hành động này sẽ thay đổi trạng thái của nhân viên
                <span className="font-medium"> {staff.name}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  onUpdateStatus(staff.id, isInactive ? "active" : "inactive")
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
