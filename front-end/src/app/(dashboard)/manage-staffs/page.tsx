"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FullStaffProfile } from "@/features/staff/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StaffForm from "@/features/staff/components/StaffForm";
import {
  addStaff,
  updateStaff,
  updateStaffStatus,
} from "@/features/staff/api/staff.api";
import { toast } from "sonner";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useServices } from "@/features/service/hooks/useServices";
import { FullPageLoader } from "@/components/ui/spinner";

type StaffFormValues = {
  name: string;
  email: string;
  phone: string;
  role: "technician" | "receptionist" | "manager";
  status: "active" | "inactive";
  serviceIds?: string[];
  avatar?: File | undefined;
};

export default function StaffManagementPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<FullStaffProfile | null>(
    null
  );

  const queryClient = useQueryClient();

  const { data: staff = [], isLoading, error } = useStaffs();

  // Thêm query để lấy danh sách dịch vụ
  const { data: services = [], isLoading: isLoadingServices } = useServices();

  // Mutation để thêm nhân viên
  const addStaffMutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setIsAddDialogOpen(false);
      toast.success("Thêm nhân viên thành công!");
    },
    onError: (err) => {
      toast.error(`Thêm nhân viên thất bại: ${err.message}`);
    },
  });

  // Thêm mutation để chỉnh sửa thông tin
  const updateStaffMutation = useMutation({
    mutationFn: ({
      staffId,
      data,
    }: {
      staffId: string;
      data: StaffFormValues;
    }) => updateStaff(staffId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setIsEditDialogOpen(false);
      toast.success("Cập nhật thông tin thành công!");
    },
    onError: (error) => {
      toast.error(`Cập nhật thông tin thất bại: ${error.message}`);
    },
  });

  // Thêm mutation để cập nhật trạng thái
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
    onError: (error) => {
      toast.error(`Cập nhật trạng thái thất bại: ${error.message}`);
    },
  });

  const handleAddStaff = (data: StaffFormValues) => {
    addStaffMutation.mutate(data);
  };

  // 6. Thêm các hàm xử lý mới
  const handleEditStaff = (staffMember: FullStaffProfile) => {
    setEditingStaff(staffMember);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStaff = (data: StaffFormValues) => {
    if (editingStaff) {
      updateStaffMutation.mutate({ staffId: editingStaff.id, data });
    }
  };

  const handleUpdateStatus = (
    staffId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateStatusMutation.mutate({ staffId, newStatus });
  };

  if (isLoading || isLoadingServices) {
    return <FullPageLoader text="Đang tải danh sách nhân viên..." />;
  }

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Nhân viên</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Thêm nhân viên mới</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo hồ sơ nhân viên mới</DialogTitle>
            </DialogHeader>
            <StaffForm
              services={services}
              onFormSubmit={handleAddStaff}
              onClose={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={columns({
          onEdit: handleEditStaff,
          onUpdateStatus: handleUpdateStatus,
        })}
        data={staff}
      />

      {/* 7. Thêm Dialog cho việc chỉnh sửa */}
      {editingStaff && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Chỉnh sửa thông tin: {editingStaff.name}
              </DialogTitle>
            </DialogHeader>
            <StaffForm
              initialData={editingStaff}
              services={services}
              onFormSubmit={handleUpdateStaff}
              onClose={() => setIsEditDialogOpen(false)}
              isSubmitting={updateStaffMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
