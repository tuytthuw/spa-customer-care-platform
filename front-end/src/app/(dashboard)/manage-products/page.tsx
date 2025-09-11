// src/app/(dashboard)/manage-products/page.tsx
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/features/product/types";
import {
  addProduct,
  updateProduct,
  updateProducteStatus,
} from "@/features/product/api/product.api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { columns } from "./columns";
import { toast } from "sonner";
import ProductForm from "@/features/product/components/ProductForm";
import { ProductFormValues } from "@/features/product/schemas";
import { useProducts } from "@/features/product/hooks/useProducts";
import { PageHeader } from "@/components/common/PageHeader";

export default function ManageProductsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useProducts();

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsAddDialogOpen(false);
      toast.success("Thêm sản phẩm thành công!");
    },
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: ProductFormValues;
    }) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsEditDialogOpen(false);
      toast.success("Cập nhật sản phẩm thành công!");
    },
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const updateProductStatusMutation = useMutation({
    mutationFn: ({
      productId,
      newStatus,
    }: {
      productId: string;
      newStatus: "active" | "inactive";
    }) => updateProducteStatus(productId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (err) =>
      toast.error(`Cập nhật trạng thái thất bại: ${err.message}`),
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  // 2. Các hàm handleAdd và handleUpdate giờ sẽ gọi cùng mutation
  const handleAddProduct = (data: ProductFormValues) => {
    addProductMutation.mutate(data);
  };

  const handleUpdateProduct = (data: ProductFormValues) => {
    if (editingProduct) {
      updateProductMutation.mutate({ productId: editingProduct.id, data });
    }
  };

  const handleUpdateProductStatus = (
    productId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateProductStatusMutation.mutate({ productId, newStatus });
  };

  if (isLoading) return <div>Đang tải danh sách sản phẩm...</div>;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Quản lý Sản phẩm"
        actionNode={
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
              </DialogHeader>
              <ProductForm
                onFormSubmit={handleAddProduct}
                onClose={() => setIsAddDialogOpen(false)}
                isSubmitting={addProductMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        columns={columns({
          onEdit: handleEdit,
          onUpdateStatus: handleUpdateProductStatus,
        })}
        data={products}
      />
      {editingProduct && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa: {editingProduct.name}</DialogTitle>
            </DialogHeader>
            {/* 4. Sử dụng cùng ProductForm cho việc "Sửa", truyền vào initialData */}
            <ProductForm
              initialData={editingProduct}
              onFormSubmit={handleUpdateProduct}
              onClose={() => setIsEditDialogOpen(false)}
              isSubmitting={updateProductMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
