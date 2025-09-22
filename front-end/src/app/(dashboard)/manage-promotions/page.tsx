"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Promotion } from "@/features/promotion/types";
import {
  PromotionFormValues,
  promotionFormSchema,
} from "@/features/promotion/schemas";
import { usePromotions } from "@/features/promotion/hooks/usePromotions";
import {
  addPromotion,
  updatePromotion,
  updatePromotionStatus,
} from "@/features/promotion/api/promotion.api";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FullPageLoader } from "@/components/ui/spinner";
import { FormDialog } from "@/components/common/FormDialog";
import PromotionFormFields from "@/features/promotion/components/PromotionFormFields";
import { columns } from "./columns";

export default function ManagePromotionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: promotions = [], isLoading, error } = usePromotions();

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
  });

  useEffect(() => {
    if (isDialogOpen) {
      if (editingPromotion) {
        form.reset({
          ...editingPromotion,
          startDate: new Date(editingPromotion.startDate),
          endDate: new Date(editingPromotion.endDate),
        });
      } else {
        form.reset({
          title: "",
          description: "",
          discountPercent: 0,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Mặc định 30 ngày
        });
      }
    }
  }, [isDialogOpen, editingPromotion, form]);

  const handleMutationSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["promotions"] });
    setIsDialogOpen(false);
    setEditingPromotion(null);
    toast.success(message);
  };

  const addPromotionMutation = useMutation({
    mutationFn: addPromotion,
    onSuccess: () => handleMutationSuccess("Thêm khuyến mãi thành công!"),
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const updatePromotionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PromotionFormValues }) =>
      updatePromotion(id, data),
    onSuccess: () => handleMutationSuccess("Cập nhật khuyến mãi thành công!"),
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "inactive";
    }) => updatePromotionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const handleOpenDialog = (promotion: Promotion | null = null) => {
    setEditingPromotion(promotion);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: PromotionFormValues) => {
    if (editingPromotion) {
      updatePromotionMutation.mutate({ id: editingPromotion.id, data });
    } else {
      addPromotionMutation.mutate(data);
    }
  };

  if (isLoading)
    return <FullPageLoader text="Đang tải danh sách khuyến mãi..." />;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Quản lý Khuyến mãi"
        actionNode={
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tạo khuyến mãi
          </Button>
        }
      />
      <DataTable
        columns={columns({
          onEdit: handleOpenDialog,
          onUpdateStatus: (id, status) =>
            updateStatusMutation.mutate({ id, status }),
        })}
        data={promotions}
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingPromotion ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi mới"}
        form={form}
        onFormSubmit={handleSubmit}
        isSubmitting={
          addPromotionMutation.isPending || updatePromotionMutation.isPending
        }
        submitText={editingPromotion ? "Lưu thay đổi" : "Tạo mới"}
      >
        <PromotionFormFields />
      </FormDialog>
    </div>
  );
}
