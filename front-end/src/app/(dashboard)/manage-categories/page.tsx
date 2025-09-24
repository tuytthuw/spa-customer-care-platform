"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Category } from "@/features/category/types";
import {
  CategoryFormValues,
  categoryFormSchema,
} from "@/features/category/schemas";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/features/category/api/category.api";
import { useCategories } from "@/features/category/hooks/useCategories";

import { DataTable } from "@/features/shared/components/ui/data-table";
import { Button } from "@/features/shared/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { columns } from "./columns";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { FormDialog } from "@/features/shared/components/common/FormDialog";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import CategoryFormFields from "@/features/category/components/CategoryFormFields";

export default function ManageCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useCategories();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
  });

  useEffect(() => {
    if (isDialogOpen) {
      if (editingCategory) {
        form.reset(editingCategory);
      } else {
        form.reset({ name: "", type: "service" });
      }
    }
  }, [isDialogOpen, editingCategory, form]); // ✅ Đã thêm `form` vào dependency array

  const handleMutationSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    setIsDialogOpen(false);
    setEditingCategory(null);
    toast.success(message);
  };

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => handleMutationSuccess("Thêm danh mục thành công!"),
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormValues }) =>
      updateCategory(id, data),
    onSuccess: () => handleMutationSuccess("Cập nhật danh mục thành công!"),
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Xóa danh mục thành công!");
    },
    onError: (err) => toast.error(`Xóa thất bại: ${err.message}`),
  });

  const handleOpenDialog = (category: Category | null = null) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: CategoryFormValues) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      addCategoryMutation.mutate(data);
    }
  };

  if (isLoading) return <FullPageLoader text="Đang tải danh mục..." />;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Quản lý Danh mục"
        actionNode={
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Thêm danh mục
          </Button>
        }
      />
      <DataTable
        columns={columns({
          onEdit: handleOpenDialog,
          onDelete: deleteCategoryMutation.mutate,
        })}
        data={categories}
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        form={form}
        onFormSubmit={handleSubmit}
        isSubmitting={
          addCategoryMutation.isPending || updateCategoryMutation.isPending
        }
        submitText={editingCategory ? "Lưu" : "Tạo mới"}
      >
        <CategoryFormFields />
      </FormDialog>
    </div>
  );
}
