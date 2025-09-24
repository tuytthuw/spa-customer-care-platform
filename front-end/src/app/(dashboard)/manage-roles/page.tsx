"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@/features/roles/types";
import { RoleFormValues, roleFormSchema } from "@/features/roles/schemas";
import { addRole, updateRole, deleteRole } from "@/features/roles/api/role.api";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { DataTable } from "@/features/shared/components/ui/data-table";
import { Button } from "@/features/shared/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { columns } from "./columns";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { FormDialog } from "@/features/shared/components/common/FormDialog";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import RoleFormFields from "@/features/roles/components/RoleFormFields";

export default function ManageRolesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const queryClient = useQueryClient();

  const { data: roles = [], isLoading, error } = useRoles();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
  });

  useEffect(() => {
    if (isDialogOpen) {
      if (editingRole) {
        form.reset(editingRole);
      } else {
        form.reset({
          name: "",
          description: "",
          permissions: {},
        });
      }
    }
  }, [isDialogOpen, editingRole, form]);

  const handleMutationSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["roles"] });
    setIsDialogOpen(false);
    setEditingRole(null);
    toast.success(message);
  };

  const addRoleMutation = useMutation({
    mutationFn: addRole,
    onSuccess: () => handleMutationSuccess("Thêm vai trò thành công!"),
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoleFormValues }) =>
      updateRole(id, data),
    onSuccess: () => handleMutationSuccess("Cập nhật vai trò thành công!"),
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Xóa vai trò thành công!");
    },
    onError: (err) => toast.error(`Xóa thất bại: ${err.message}`),
  });

  const handleOpenDialog = (role: Role | null = null) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: RoleFormValues) => {
    if (editingRole) {
      updateRoleMutation.mutate({ id: editingRole.id, data });
    } else {
      addRoleMutation.mutate(data);
    }
  };

  if (isLoading)
    return <FullPageLoader text="Đang tải dữ liệu phân quyền..." />;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Quản lý Phân quyền"
        description="Tạo và tùy chỉnh các vai trò người dùng trong hệ thống."
        actionNode={
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Thêm vai trò mới
          </Button>
        }
      />
      <DataTable
        columns={columns({
          onEdit: handleOpenDialog,
          onDelete: deleteRoleMutation.mutate,
        })}
        data={roles}
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={
          editingRole ? `Chỉnh sửa: ${editingRole.name}` : "Tạo vai trò mới"
        }
        form={form}
        onFormSubmit={handleSubmit}
        isSubmitting={addRoleMutation.isPending || updateRoleMutation.isPending}
        submitText={editingRole ? "Lưu thay đổi" : "Tạo mới"}
      >
        <RoleFormFields />
      </FormDialog>
    </div>
  );
}
