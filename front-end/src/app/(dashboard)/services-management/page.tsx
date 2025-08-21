// src/app/(dashboard)/services-management/page.tsx (PHIÊN BẢN NÂNG CẤP)
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@/types/service";
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
import AddServiceForm from "@/components/forms/AddServiceForm";
import { getServices } from "@/services/serviceService"; // Import service

interface ServiceFormValues {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  imageUrl?: string;
}

export default function ServicesManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sử dụng useQuery để fetch dữ liệu
  const {
    data: services = [],
    isLoading,
    error,
  } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const handleAddService = (data: ServiceFormValues) => {
    console.log("Đã thêm dịch vụ mới:", data);
  };

  if (isLoading) {
    return <div>Đang tải danh sách dịch vụ...</div>;
  }

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Dịch vụ</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Thêm dịch vụ mới</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo dịch vụ mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết để thêm một dịch vụ mới vào hệ thống.
              </DialogDescription>
            </DialogHeader>
            <AddServiceForm
              onFormSubmit={handleAddService}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={services} />
    </div>
  );
}
