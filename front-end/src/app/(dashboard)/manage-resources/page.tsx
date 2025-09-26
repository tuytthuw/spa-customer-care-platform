"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resource } from "@/features/resource/types";
import {
  getResources,
  addResource,
  updateResource,
} from "@/features/resource/api/resource.api";
import {
  resourceFormSchema,
  ResourceFormValues,
} from "@/features/resource/schemas";

import { DataTable } from "@/features/shared/components/ui/data-table";
import { Button } from "@/features/shared/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { columns } from "./columns";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { FormDialog } from "@/features/shared/components/common/FormDialog";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";
import ResourceFormFields from "@/features/resource/components/ResourceFormFields";

export default function ManageResourcesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const queryClient = useQueryClient();

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: { name: "", type: "room", notes: "" },
  });

  useEffect(() => {
    if (isDialogOpen) {
      if (editingResource) {
        form.reset(editingResource);
      } else {
        form.reset({ name: "", type: "room", notes: "" });
      }
    }
  }, [isDialogOpen, editingResource, form]);

  const handleMutationSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["resources"] });
    setIsDialogOpen(false);
    setEditingResource(null);
    toast.success(message);
  };

  const addResourceMutation = useMutation({
    mutationFn: addResource,
    onSuccess: () => handleMutationSuccess("Thêm tài nguyên thành công!"),
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResourceFormValues }) =>
      updateResource(id, data),
    onSuccess: () => handleMutationSuccess("Cập nhật tài nguyên thành công!"),
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const handleOpenDialog = (resource: Resource | null = null) => {
    setEditingResource(resource);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: ResourceFormValues) => {
    if (editingResource) {
      updateResourceMutation.mutate({ id: editingResource.id, data });
    } else {
      addResourceMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Quản lý Phòng & Thiết bị"
        actionNode={
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Thêm tài nguyên
          </Button>
        }
      />
      <DataTable
        columns={columns({ onEdit: handleOpenDialog })}
        data={resources}
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingResource ? "Chỉnh sửa tài nguyên" : "Thêm tài nguyên mới"}
        form={form}
        onFormSubmit={handleSubmit}
        isSubmitting={
          addResourceMutation.isPending || updateResourceMutation.isPending
        }
        submitText={editingResource ? "Lưu thay đổi" : "Tạo mới"}
      >
        <ResourceFormFields />
      </FormDialog>
    </div>
  );
}
