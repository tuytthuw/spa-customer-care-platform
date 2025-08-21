"use client";

import { useEffect, useState } from "react";
import { mockStaff } from "@/lib/mock-data";
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
import AddStaffForm from "@/components/screens/staff-management/AddStaffForm";

interface StaffFormValues {
  name: string;
  email: string;
  phone: string;
  role: "technician" | "receptionist" | "manager";
}

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setStaff(mockStaff);
    setIsLoading(false);
  }, []);

  const handleAddStaff = (data: StaffFormValues) => {
    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      ...data,
      status: "active",
    };
    setStaff((prev) => [newStaff, ...prev]);
    console.log("Đã thêm nhân viên mới:", newStaff);
  };

  if (isLoading) {
    return <div>Đang tải danh sách nhân viên...</div>;
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
