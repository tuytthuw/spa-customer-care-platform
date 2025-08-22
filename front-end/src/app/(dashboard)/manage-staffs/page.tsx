// src/app/(dashboard)/staff-management/page.tsx (PHIÊN BẢN NÂNG CẤP)
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Staff } from "@/types/staff";
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
import AddStaffForm from "@/components/forms/AddStaffForm";
import { getStaff } from "@/services/staffService"; // Import service

interface StaffFormValues {
  name: string;
  email: string;
  phone: string;
  role: "technician" | "receptionist" | "manager";
}

export default function StaffManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sử dụng useQuery để fetch dữ liệu
  const {
    data: staff = [],
    isLoading,
    error,
  } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  const handleAddStaff = (data: StaffFormValues) => {
    // Tạm thời giữ lại, sẽ nâng cấp với useMutation
    console.log("Đã thêm nhân viên mới:", data);
  };

  if (isLoading) {
    return <div>Đang tải danh sách nhân viên...</div>;
  }

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Nhân viên</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Thêm nhân viên mới</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo hồ sơ nhân viên mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết để thêm nhân viên vào hệ thống.
              </DialogDescription>
            </DialogHeader>
            <AddStaffForm
              onFormSubmit={handleAddStaff}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={staff} />
    </div>
  );
}
