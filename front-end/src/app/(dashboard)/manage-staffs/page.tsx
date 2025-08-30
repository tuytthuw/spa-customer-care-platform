"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Staff } from "@/features/staff/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddStaffForm from "@/features/staff/components/AddStaffForm";
import EditStaffForm from "@/features/staff/components/EditStaffForm"; // 1. Import form chỉnh sửa
import {
  getStaff,
  addStaff,
  updateStaff,
  updateStaffStatus,
} from "@/features/staff/api/staff.api"; // 2. Import các hàm mới
import { toast } from "sonner";

type StaffFormValues = {
  name: string;
  email: string;
  phone: string;
  role: "technician" | "receptionist" | "manager";
  status: "active" | "inactive";
  serviceIds?: string[];
  avatar?: any;
};

export default function StaffManagementPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // 3. Thêm state để quản lý dialog chỉnh sửa
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const queryClient = useQueryClient();

  const {
    data: staff = [],
    isLoading,
    error,
  } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

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
  const handleEditStaff = (staffMember: Staff) => {
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

  if (isLoading) {
    return <div>Đang tải danh sách nhân viên...</div>;
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
            <AddStaffForm
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
            <EditStaffForm
              initialData={editingStaff}
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
