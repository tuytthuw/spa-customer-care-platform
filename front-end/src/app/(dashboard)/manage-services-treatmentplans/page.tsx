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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddServiceForm from "@/components/forms/AddServiceForm";
import AddTreatmentPlanForm from "@/components/forms/AddTreatmentPlanForm";
import EditServiceForm from "@/components/forms/EditServiceForm";
import EditTreatmentPlanForm from "@/components/forms/EditTreatmentPlanForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { treatmentPlanColumns } from "./treatment-plan-columns";
import {
  getServices,
  addService,
  updateService,
  updateServiceStatus,
} from "@/services/serviceService";
import {
  getTreatmentPlans,
  addTreatmentPlan,
  updateTreatmentPlan,
  updateTreatmentPlanStatus,
} from "@/services/treatmentPlanService";
import { toast } from "sonner";

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
  const [isServiceAddOpen, setIsServiceAddOpen] = useState(false);
  const [isPlanAddOpen, setIsPlanAddOpen] = useState(false);
  const [isServiceEditOpen, setIsServiceEditOpen] = useState(false);
  const [isPlanEditOpen, setIsPlanEditOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPlan, setEditingPlan] = useState<TreatmentPlan | null>(null);

  const queryClient = useQueryClient();

  // Queries
  const { data: services = [], isLoading: isLoadingServices } = useQuery<
    Service[]
  >({ queryKey: ["services"], queryFn: getServices });
  const { data: treatmentPlans = [], isLoading: isLoadingPlans } = useQuery<
    TreatmentPlan[]
  >({ queryKey: ["treatmentPlans"], queryFn: getTreatmentPlans });

  // Mutations for Services
  const addServiceMutation = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsServiceAddOpen(false);
      toast.success("Thêm dịch vụ thành công!");
    },
    onError: (err) => {
      toast.error(`Thêm dịch vụ thất bại: ${err.message}`);
    },
  });
  const updateServiceMutation = useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: any }) =>
      updateService(serviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsServiceEditOpen(false);
      toast.success("Cập nhật dịch vụ thành công!");
    },
    onError: (err) => {
      toast.error(`Cập nhật dịch vụ thất bại: ${err.message}`);
    },
  });
  const updateServiceStatusMutation = useMutation({
    mutationFn: ({
      serviceId,
      newStatus,
    }: {
      serviceId: string;
      newStatus: "active" | "inactive";
    }) => updateServiceStatus(serviceId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (err) => {
      toast.error(`Cập nhật trạng thái thất bại: ${err.message}`);
    },
  });

  // Mutations for Treatment Plans
  const addPlanMutation = useMutation({
    mutationFn: addTreatmentPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] });
      setIsPlanAddOpen(false);
      toast.success("Thêm liệu trình thành công!");
    },
    onError: (err) => {
      toast.error(`Thêm liệu trình thất bại: ${err.message}`);
    },
  });
  const updatePlanMutation = useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: any }) =>
      updateTreatmentPlan(planId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] });
      setIsPlanEditOpen(false);
      toast.success("Cập nhật liệu trình thành công!");
    },
    onError: (err) => {
      toast.error(`Cập nhật liệu trình thất bại: ${err.message}`);
    },
  });
  const updatePlanStatusMutation = useMutation({
    mutationFn: ({
      planId,
      newStatus,
    }: {
      planId: string;
      newStatus: "active" | "inactive";
    }) => updateTreatmentPlanStatus(planId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (err) => {
      toast.error(`Cập nhật trạng thái thất bại: ${err.message}`);
    },
  });

  // Handlers
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsServiceEditOpen(true);
  };
  const handleUpdateService = (data: ServiceFormValues) => {
    if (editingService) {
      updateServiceMutation.mutate({ serviceId: editingService.id, data });
    }
  };
  const handleUpdateServiceStatus = (
    serviceId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateServiceStatusMutation.mutate({ serviceId, newStatus });
  };

  const handleEditPlan = (plan: TreatmentPlan) => {
    setEditingPlan(plan);
    setIsPlanEditOpen(true);
  };
  const handleUpdatePlan = (data: TreatmentPlanFormValues) => {
    if (editingPlan) {
      updatePlanMutation.mutate({ planId: editingPlan.id, data });
    }
  };
  const handleUpdatePlanStatus = (
    planId: string,
    newStatus: "active" | "inactive"
  ) => {
    updatePlanStatusMutation.mutate({ planId, newStatus });
  };

  if (isLoadingServices || isLoadingPlans) return <div>Đang tải...</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý Dịch vụ & Liệu trình</h1>
      <Tabs defaultValue="services">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="services">Dịch vụ lẻ</TabsTrigger>
          <TabsTrigger value="treatment_plans">Liệu trình</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-4">
          <div className="text-right mb-4">
            <Dialog open={isServiceAddOpen} onOpenChange={setIsServiceAddOpen}>
              <DialogTrigger asChild>
                <Button>Thêm dịch vụ mới</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo dịch vụ mới</DialogTitle>
                </DialogHeader>
                <AddServiceForm
                  onFormSubmit={(data) => addServiceMutation.mutate(data)}
                  onClose={() => setIsServiceAddOpen(false)}
                  isSubmitting={addServiceMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
          <DataTable
            columns={serviceColumns({
              onEdit: handleEditService,
              onUpdateStatus: handleUpdateServiceStatus,
            })}
            data={services}
          />
        </TabsContent>
        <TabsContent value="treatment_plans" className="mt-4">
          <div className="text-right mb-4">
            <Dialog open={isPlanAddOpen} onOpenChange={setIsPlanAddOpen}>
              <DialogTrigger asChild>
                <Button>Thêm Liệu trình mới</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo liệu trình mới</DialogTitle>
                </DialogHeader>
                <AddTreatmentPlanForm
                  onFormSubmit={(data) => addPlanMutation.mutate(data)}
                  onClose={() => setIsPlanAddOpen(false)}
                  isSubmitting={addPlanMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
          <DataTable
            columns={treatmentPlanColumns({
              onEdit: handleEditPlan,
              onUpdateStatus: handleUpdatePlanStatus,
            })}
            data={treatmentPlans}
          />
        </TabsContent>
      </Tabs>
      {editingService && (
        <Dialog open={isServiceEditOpen} onOpenChange={setIsServiceEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa: {editingService.name}</DialogTitle>
            </DialogHeader>
            <EditServiceForm
              initialData={editingService}
              onFormSubmit={handleUpdateService}
              onClose={() => setIsServiceEditOpen(false)}
              isSubmitting={updateServiceMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
      {editingPlan && (
        <Dialog open={isPlanEditOpen} onOpenChange={setIsPlanEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa: {editingPlan.name}</DialogTitle>
            </DialogHeader>
            <EditTreatmentPlanForm
              initialData={editingPlan}
              onFormSubmit={handleUpdatePlan}
              onClose={() => setIsPlanEditOpen(false)}
              isSubmitting={updatePlanMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
