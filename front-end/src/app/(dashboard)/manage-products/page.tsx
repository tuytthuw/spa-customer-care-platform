// src/app/(dashboard)/manage-products/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/features/product/types";
import {
  getProducts,
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
import AddProductForm from "@/features/product/components/AddProductForm";
import EditProductForm from "@/features/product/components/EditProductForm";
import { ProductFormValues } from "@/features/product/schemas";

export default function ManageProductsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

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

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Xóa sản phẩm thành công!");
    },
    onError: (err) => toast.error(`Xóa thất bại: ${err.message}`),
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: ProductFormValues) => {
    if (editingProduct) {
      updateProductMutation.mutate({ productId: editingProduct.id, data });
    }
  };

  if (isLoading) return <div>Đang tải danh sách sản phẩm...</div>;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
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
            <AddProductForm
              onFormSubmit={(data) => addProductMutation.mutate(data)}
              onClose={() => setIsAddDialogOpen(false)}
              isSubmitting={addProductMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={columns({
          onEdit: handleEdit,
          onDelete: (id) => deleteProductMutation.mutate(id),
        })}
        data={products}
      />
      {editingProduct && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa: {editingProduct.name}</DialogTitle>
            </DialogHeader>
            <EditProductForm
              initialData={editingProduct}
              onFormSubmit={handleUpdate}
              onClose={() => setIsEditDialogOpen(false)}
              isSubmitting={updateProductMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
