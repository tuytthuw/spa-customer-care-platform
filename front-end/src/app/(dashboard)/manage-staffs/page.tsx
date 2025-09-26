"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FullStaffProfile } from "@/features/staff/types";
import { StaffFormValues, staffFormSchema } from "@/features/staff/schemas";
import {
  addStaff,
  updateStaff,
  updateStaffStatus,
} from "@/features/staff/api/staff.api";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useServices } from "@/features/service/hooks/useServices";

import { DataTable } from "@/features/shared/components/ui/data-table";
import { Button } from "@/features/shared/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { columns } from "./columns";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { FormDialog } from "@/features/shared/components/common/FormDialog";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";
import StaffFormFields from "@/features/staff/components/StaffForm";
export default function StaffManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<FullStaffProfile | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: staff = [], isLoading, error } = useStaffs();
  const { data: services = [], isLoading: isLoadingServices } = useServices();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
  });

  useEffect(() => {
    if (isDialogOpen) {
      if (editingStaff) {
        form.reset(editingStaff);
      } else {
        form.reset({
          name: "",
          email: "",
          phone: "",
          role: "technician",
          status: "active",
          serviceIds: [],
          avatar: undefined,
        });
      }
    }
  }, [isDialogOpen, editingStaff, form]);

  const handleMutationSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["staff"] });
    setIsDialogOpen(false);
    setEditingStaff(null);
    toast.success(message);
  };

  const addStaffMutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => handleMutationSuccess("Thêm nhân viên thành công!"),
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({
      staffId,
      data,
    }: {
      staffId: string;
      data: StaffFormValues;
    }) => updateStaff(staffId, data),
    onSuccess: () => handleMutationSuccess("Cập nhật thông tin thành công!"),
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      staffId,
      newStatus,
    }: {
      staffId: string;
      newStatus: "active" | "inactive";
    }) => updateStaffStatus(staffId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const handleOpenDialog = (staffMember: FullStaffProfile | null = null) => {
    setEditingStaff(staffMember);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (data: StaffFormValues) => {
    if (editingStaff) {
      updateStaffMutation.mutate({ staffId: editingStaff.id, data });
    } else {
      addStaffMutation.mutate(data);
    }
  };

  const handleUpdateStatus = (
    staffId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateStatusMutation.mutate({ staffId, newStatus });
  };

  if (isLoading || isLoadingServices) {
    return <FullPageLoader />;
  }
  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Quản lý Nhân viên"
        actionNode={
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm nhân viên mới
          </Button>
        }
      />
      <DataTable
        columns={columns({
          onEdit: handleOpenDialog,
          onUpdateStatus: handleUpdateStatus,
        })}
        data={staff}
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={
          editingStaff
            ? `Chỉnh sửa: ${editingStaff.name}`
            : "Tạo hồ sơ nhân viên"
        }
        form={form}
        onFormSubmit={handleFormSubmit}
        isSubmitting={
          addStaffMutation.isPending || updateStaffMutation.isPending
        }
        submitText={editingStaff ? "Lưu thay đổi" : "Tạo mới"}
      >
        <StaffFormFields services={services} />
      </FormDialog>
    </div>
  );
}
