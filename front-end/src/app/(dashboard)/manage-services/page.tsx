"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@/types/service";
import { columns as serviceColumns } from "./columns";
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
// Giả lập service để code chạy được, bạn sẽ thay bằng API thật
import { mockServices, mockTreatmentPlans } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { treatmentPlanColumns } from "./treatment-plan-columns"; // Import columns cho liệu trình

// --- SỬA LỖI Ở ĐÂY ---
interface ServiceFormValues {
  name: string;
  description?: string; // Thêm dấu '?' để cho phép description là optional
  category: string;
  price: number;
  duration: number;
  imageUrl?: string;
}

// Giả lập hàm getServices
const getServices = async (): Promise<Service[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockServices), 500));
};

export default function ServicesManagementPage() {
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  // Sử dụng useQuery để fetch dữ liệu dịch vụ lẻ
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
    // Ở đây bạn sẽ gọi mutation để thêm service và invalidate query "services"
    setIsServiceDialogOpen(false);
  };

  const handleAddPlan = (data: any) => {
    console.log("Đã thêm liệu trình mới:", data);
    // Ở đây bạn sẽ gọi mutation để thêm plan và invalidate query "treatment_plans"
    setIsPlanDialogOpen(false);
  };

  if (isLoading) {
    return <div>Đang tải danh sách dịch vụ...</div>;
  }

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Dịch vụ & Liệu trình</h1>
      </div>

      <Tabs defaultValue="services">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="services">Dịch vụ lẻ</TabsTrigger>
          <TabsTrigger value="treatment_plans">Liệu trình</TabsTrigger>
        </TabsList>

        {/* Tab 1: Quản lý Dịch vụ lẻ */}
        <TabsContent value="services" className="mt-4">
          <div className="text-right mb-4">
            <Dialog
              open={isServiceDialogOpen}
              onOpenChange={setIsServiceDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Thêm dịch vụ mới</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo dịch vụ mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin chi tiết để thêm một dịch vụ mới vào hệ
                    thống.
                  </DialogDescription>
                </DialogHeader>
                <AddServiceForm
                  onFormSubmit={handleAddService}
                  onClose={() => setIsServiceDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <DataTable columns={serviceColumns} data={services} />
        </TabsContent>

        {/* Tab 2: Quản lý Liệu trình */}
        <TabsContent value="treatment_plans" className="mt-4">
          <div className="text-right mb-4">
            <Button
              onClick={() => alert("Form thêm liệu trình chưa được tạo!")}
            >
              Thêm Liệu trình mới
            </Button>
          </div>
          <DataTable columns={treatmentPlanColumns} data={mockTreatmentPlans} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
