"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Service } from "@/types/service";
import { TreatmentPlan } from "@/types/treatmentPlan";
import { columns as serviceColumns } from "./service-columns";
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
import AddTreatmentPlanForm from "@/components/forms/AddTreatmentPlanForm"; // 1. Import form mới
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { treatmentPlanColumns } from "./treatment-plan-columns";
import { getServices, addService } from "@/services/serviceService";
import {
  getTreatmentPlans,
  addTreatmentPlan,
} from "@/services/treatmentPlanService"; // 2. Import service mới

type ServiceFormValues = {
  name: string;
  description?: string;
  category: string;
  price: number;
  duration: number;
  imageFile?: any;
};
type TreatmentPlanFormValues = {
  name: string;
  description?: string;
  price: number;
  totalSessions: number;
  imageFile?: any;
};

export default function ServicesManagementPage() {
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Query cho dịch vụ lẻ
  const { data: services = [], isLoading: isLoadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  // 3. Query cho liệu trình
  const { data: treatmentPlans = [], isLoading: isLoadingPlans } = useQuery<
    TreatmentPlan[]
  >({
    queryKey: ["treatmentPlans"],
    queryFn: getTreatmentPlans,
  });

  // Mutation cho dịch vụ lẻ
  const addServiceMutation = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsServiceDialogOpen(false);
    },
    onError: (err) => {
      alert("Thêm dịch vụ thất bại!");
    },
  });

  // 4. Mutation cho liệu trình
  const addPlanMutation = useMutation({
    mutationFn: addTreatmentPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] });
      setIsPlanDialogOpen(false);
    },
    onError: (err) => {
      alert("Thêm liệu trình thất bại!");
    },
  });

  const handleAddService = (data: ServiceFormValues) => {
    addServiceMutation.mutate(data);
  };

  const handleAddPlan = (data: TreatmentPlanFormValues) => {
    addPlanMutation.mutate(data);
  };

  if (isLoadingServices || isLoadingPlans) {
    return <div>Đang tải dữ liệu...</div>;
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
                </DialogHeader>
                <AddServiceForm
                  onFormSubmit={handleAddService}
                  onClose={() => setIsServiceDialogOpen(false)}
                  isSubmitting={addServiceMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
          <DataTable columns={serviceColumns} data={services} />
        </TabsContent>

        {/* 5. Cập nhật Tab Liệu trình */}
        <TabsContent value="treatment_plans" className="mt-4">
          <div className="text-right mb-4">
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button>Thêm Liệu trình mới</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo liệu trình mới</DialogTitle>
                </DialogHeader>
                <AddTreatmentPlanForm
                  onFormSubmit={handleAddPlan}
                  onClose={() => setIsPlanDialogOpen(false)}
                  isSubmitting={addPlanMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
          <DataTable columns={treatmentPlanColumns} data={treatmentPlans} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
