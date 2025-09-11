"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/features/category/types";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/features/category/api/category.api";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { columns } from "./columns";
import { toast } from "sonner";
import { useCategories } from "@/features/category/hooks/useCategories";
import { FullPageLoader } from "@/components/ui/spinner";
import { PageHeader } from "@/components/common/PageHeader";
import { CategoryFormValues } from "@/features/category/schemas";
import CategoryForm from "@/features/category/components/CategoryForm";

export default function ManageCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useCategories();

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
      <PageHeader title="Quản lý Danh mục" />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            initialData={editingCategory}
            onFormSubmit={handleSubmit}
            onClose={() => setIsDialogOpen(false)}
            isSubmitting={
              addCategoryMutation.isPending || updateCategoryMutation.isPending
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
