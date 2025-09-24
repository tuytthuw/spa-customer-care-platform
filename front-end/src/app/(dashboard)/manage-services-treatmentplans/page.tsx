"use client";

import { treatmentPlanColumns } from "./treatment-plan-columns";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Service } from "@/features/service/types";
import { TreatmentPlan } from "@/features/treatment/types";
import {
  ServiceFormValues,
  serviceFormSchema,
} from "@/features/service/schemas";
import {
  TreatmentPlanFormValues,
  treatmentPlanFormSchema,
} from "@/features/treatment/schemas";
import {
  addService,
  updateService,
  updateServiceStatus,
} from "@/features/service/api/service.api";
import {
  addTreatmentPlan,
  updateTreatmentPlan,
  updateTreatmentPlanStatus,
} from "@/features/treatment/api/treatment.api";
import { useServices } from "@/features/service/hooks/useServices";
import { useTreatmentPlans } from "@/features/treatment/hooks/useTreatmentPlans";
import { DataTable } from "@/features/shared/components/ui/data-table";
import { Button } from "@/features/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/shared/components/ui/tabs";
import { toast } from "sonner";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { FormDialog } from "@/features/shared/components/common/FormDialog";
import ServiceFormFields from "@/features/service/components/ServiceForm";
import TreatmentPlanFormFields from "@/features/treatment/components/TreatmentPlanForm";
import { columns as serviceColumns } from "./service-columns";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import { PlusCircle } from "lucide-react";

export default function ServicesManagementPage() {
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TreatmentPlan | null>(null);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading: isLoadingServices } = useServices();
  const { data: treatmentPlans = [], isLoading: isLoadingPlans } =
    useTreatmentPlans();

  const serviceForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
  });
  const planForm = useForm<TreatmentPlanFormValues>({
    resolver: zodResolver(treatmentPlanFormSchema),
  });

  useEffect(() => {
    if (isServiceDialogOpen) {
      if (editingService) {
        serviceForm.reset(editingService);
      } else {
        serviceForm.reset({
          name: "",
          description: "",
          categories: [],
          price: 0,
          duration: 30,
          imageFile: undefined,
        });
      }
    }
  }, [isServiceDialogOpen, editingService, serviceForm]);

  useEffect(() => {
    if (isPlanDialogOpen) {
      if (editingPlan) {
        planForm.reset(editingPlan);
      } else {
        planForm.reset({
          name: "",
          description: "",
          categories: [],
          price: 0,
          steps: [{ serviceIds: [] }],
          imageFile: undefined,
        });
      }
    }
  }, [isPlanDialogOpen, editingPlan, planForm]);

  const handleMutationSuccess = (
    queryKey: string[],
    message: string,
    closeDialog: () => void
  ) => {
    queryClient.invalidateQueries({ queryKey });
    closeDialog();
    toast.success(message);
  };

  const addServiceMutation = useMutation({
    mutationFn: addService,
    onSuccess: () =>
      handleMutationSuccess(["services"], "Thêm dịch vụ thành công!", () =>
        setIsServiceDialogOpen(false)
      ),
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({
      serviceId,
      data,
    }: {
      serviceId: string;
      data: ServiceFormValues;
    }) => updateService(serviceId, data),
    onSuccess: () =>
      handleMutationSuccess(["services"], "Cập nhật dịch vụ thành công!", () =>
        setIsServiceDialogOpen(false)
      ),
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
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
    onError: (err) =>
      toast.error(`Cập nhật trạng thái thất bại: ${err.message}`),
  });

  const addPlanMutation = useMutation({
    mutationFn: addTreatmentPlan,
    onSuccess: () =>
      handleMutationSuccess(
        ["treatmentPlans"],
        "Thêm liệu trình thành công!",
        () => setIsPlanDialogOpen(false)
      ),
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({
      planId,
      data,
    }: {
      planId: string;
      data: TreatmentPlanFormValues;
    }) => updateTreatmentPlan(planId, data),
    onSuccess: () =>
      handleMutationSuccess(
        ["treatmentPlans"],
        "Cập nhật liệu trình thành công!",
        () => setIsPlanDialogOpen(false)
      ),
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
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
    onError: (err) =>
      toast.error(`Cập nhật trạng thái thất bại: ${err.message}`),
  });

  const handleServiceSubmit = (data: ServiceFormValues) => {
    if (editingService) {
      updateServiceMutation.mutate({ serviceId: editingService.id, data });
    } else {
      addServiceMutation.mutate(data);
    }
  };

  const handlePlanSubmit = (data: TreatmentPlanFormValues) => {
    if (editingPlan) {
      updatePlanMutation.mutate({ planId: editingPlan.id, data });
    } else {
      addPlanMutation.mutate(data);
    }
  };

  const handleOpenServiceDialog = (service: Service | null = null) => {
    setEditingService(service);
    setIsServiceDialogOpen(true);
  };

  const handleOpenPlanDialog = (plan: TreatmentPlan | null = null) => {
    setEditingPlan(plan);
    setIsPlanDialogOpen(true);
  };

  const handleUpdateServiceStatus = (
    serviceId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateServiceStatusMutation.mutate({ serviceId, newStatus });
  };

  const handleUpdatePlanStatus = (
    planId: string,
    newStatus: "active" | "inactive"
  ) => {
    updatePlanStatusMutation.mutate({ planId, newStatus });
  };

  if (isLoadingServices || isLoadingPlans)
    return <FullPageLoader text="Đang tải dữ liệu..." />;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Quản lý Dịch vụ & Liệu trình" />
      <Tabs defaultValue="services">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="services">Dịch vụ lẻ</TabsTrigger>
          <TabsTrigger value="treatment_plans">Liệu trình</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-4">
          <div className="text-right mb-4">
            <Button onClick={() => handleOpenServiceDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm dịch vụ mới
            </Button>
          </div>
          <DataTable
            columns={serviceColumns({
              onEdit: handleOpenServiceDialog,
              onUpdateStatus: handleUpdateServiceStatus,
            })}
            data={services}
          />
        </TabsContent>
        <TabsContent value="treatment_plans" className="mt-4">
          <div className="text-right mb-4">
            <Button onClick={() => handleOpenPlanDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm Liệu trình mới
            </Button>
          </div>
          <DataTable
            columns={treatmentPlanColumns({
              onEdit: handleOpenPlanDialog,
              onUpdateStatus: handleUpdatePlanStatus,
            })}
            data={treatmentPlans}
          />
        </TabsContent>
      </Tabs>

      <FormDialog
        isOpen={isServiceDialogOpen}
        onClose={() => setIsServiceDialogOpen(false)}
        title={
          editingService ? `Sửa: ${editingService.name}` : "Tạo dịch vụ mới"
        }
        form={serviceForm}
        onFormSubmit={handleServiceSubmit}
        isSubmitting={
          addServiceMutation.isPending || updateServiceMutation.isPending
        }
        submitText={editingService ? "Lưu" : "Tạo mới"}
      >
        <ServiceFormFields />
      </FormDialog>

      <FormDialog
        isOpen={isPlanDialogOpen}
        onClose={() => setIsPlanDialogOpen(false)}
        title={editingPlan ? `Sửa: ${editingPlan.name}` : "Tạo liệu trình mới"}
        form={planForm}
        onFormSubmit={handlePlanSubmit}
        isSubmitting={addPlanMutation.isPending || updatePlanMutation.isPending}
        submitText={editingPlan ? "Lưu" : "Tạo mới"}
      >
        <TreatmentPlanFormFields />
      </FormDialog>
    </div>
  );
}
