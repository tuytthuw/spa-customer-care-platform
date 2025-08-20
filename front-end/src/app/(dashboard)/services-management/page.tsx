"use client";

import { useEffect, useState } from "react";
import { mockServices } from "@/lib/mock-data";
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
import AddServiceForm from "@/components/screens/services-management/AddServiceForm";

// Định nghĩa kiểu dữ liệu cho form values
interface ServiceFormValues {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  imageUrl?: string;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Mô phỏng việc gọi API
    setServices(mockServices);
    setIsLoading(false);
  }, []);

  const handleAddService = (data: ServiceFormValues) => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      ...data,
      imageUrl: data.imageUrl || "/images/service-placeholder.jpg", // Cung cấp ảnh mặc định
    };
    setServices((prev) => [newService, ...prev]);
    console.log("Đã thêm dịch vụ mới:", newService);
  };

  if (isLoading) {
    return <div>Đang tải danh sách dịch vụ...</div>;
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
