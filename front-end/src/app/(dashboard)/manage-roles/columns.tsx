"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Role } from "@/features/roles/types";
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
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

interface GetColumnsProps {
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
}

export const columns = ({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: "Tên vai trò",
    cell: ({ row }) => (
      <div>
        <p className="font-bold">{row.original.name}</p>
        <p className="text-sm text-muted-foreground">
          {row.original.description}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original;
      // Không cho xóa các vai trò hệ thống
      const isSystemRole = [
        "manager",
        "receptionist",
        "technician",
        "customer",
      ].includes(role.id);

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
              <DropdownMenuItem onClick={() => onEdit(role)}>
                Sửa quyền
              </DropdownMenuItem>
              {!isSystemRole && (
                <>
                  <DropdownMenuSeparator />
                  <ConfirmationModal
                    trigger={
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        Xóa
                      </DropdownMenuItem>
                    }
                    title="Xác nhận xóa vai trò?"
                    description={
                      <>
                        Bạn có chắc chắn muốn xóa vai trò{" "}
                        <strong>{role.name}</strong>?
                      </>
                    }
                    onConfirm={() => onDelete(role.id)}
                    confirmText="Đúng, xóa"
                    isDestructive={true}
                  />
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
