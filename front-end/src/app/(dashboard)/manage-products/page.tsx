// src/app/(dashboard)/manage-products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/features/product/types";
import { DataTable } from "@/features/shared/components/ui/data-table";
import { Button } from "@/features/shared/components/ui/button";
import { PlusCircle, Inbox } from "lucide-react";
import { columns } from "./columns";
import { toast } from "sonner";

import { useProducts } from "@/features/product/hooks/useProducts";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { FormDialog } from "@/features/shared/components/common/FormDialog";
import ProductFormFields from "@/features/product/components/ProductForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";
import AddStockFormFields from "@/features/product/components/AddStockFormFields";
import {
  productFormSchema,
  ProductFormValues,
  addStockSchema,
  AddStockFormValues,
} from "@/features/product/schemas";
import {
  addProduct,
  updateProduct,
  updateProductStatus,
  addProductStock,
} from "@/features/product/api/product.api";

export default function ManageProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useProducts();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
  });

  const addStockForm = useForm<AddStockFormValues>({
    resolver: zodResolver(addStockSchema),
  });

  useEffect(() => {
    if (isDialogOpen) {
      if (editingProduct) {
        form.reset(editingProduct);
      } else {
        form.reset({
          name: "",
          description: "",
          categories: [],
          price: 0,
          stock: 0,
          imageFile: undefined,
          isRetail: false,
          isConsumable: false,
          baseUnit: "",
          consumableUnit: "",
          conversionRate: 0,
        });
      }
    }
  }, [isDialogOpen, editingProduct, form]);

  const handleMutationSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    setIsDialogOpen(false);
    setEditingProduct(null);
    setIsAddStockOpen(false);
    toast.success(message);
  };

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => handleMutationSuccess("Thêm sản phẩm thành công!"),
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
    onSuccess: () => handleMutationSuccess("Cập nhật sản phẩm thành công!"),
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const updateProductStatusMutation = useMutation({
    mutationFn: ({
      productId,
      newStatus,
    }: {
      productId: string;
      newStatus: "active" | "inactive";
    }) => updateProductStatus(productId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (err) =>
      toast.error(`Cập nhật trạng thái thất bại: ${err.message}`),
  });

  const addStockMutation = useMutation({
    mutationFn: addProductStock,
    onSuccess: () => handleMutationSuccess("Nhập kho thành công!"),
    onError: (err) => toast.error(`Nhập kho thất bại: ${err.message}`),
  });

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleAddStockSubmit = (data: AddStockFormValues) => {
    addStockMutation.mutate(data);
  };

  const handleFormSubmit = (data: ProductFormValues) => {
    if (editingProduct) {
      updateProductMutation.mutate({ productId: editingProduct.id, data });
    } else {
      addProductMutation.mutate(data);
    }
  };

  const handleUpdateProductStatus = (
    productId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateProductStatusMutation.mutate({ productId, newStatus });
  };

  if (isLoading) return <FullPageLoader />;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Quản lý Sản phẩm"
        actionNode={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddStockOpen(true)}>
              <Inbox className="mr-2 h-4 w-4" /> Nhập kho
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm sản phẩm
            </Button>
          </div>
        }
      />
      <DataTable
        columns={columns({
          onEdit: handleOpenDialog,
          onUpdateStatus: handleUpdateProductStatus,
        })}
        data={products}
      />
      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={
          editingProduct
            ? `Chỉnh sửa: ${editingProduct.name}`
            : "Thêm sản phẩm mới"
        }
        form={form}
        onFormSubmit={handleFormSubmit}
        isSubmitting={
          addProductMutation.isPending || updateProductMutation.isPending
        }
        submitText={editingProduct ? "Lưu thay đổi" : "Thêm mới"}
      >
        <ProductFormFields />
      </FormDialog>

      <FormDialog
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        title="Nhập kho sản phẩm"
        form={addStockForm}
        onFormSubmit={handleAddStockSubmit}
        isSubmitting={addStockMutation.isPending}
        submitText="Xác nhận nhập"
      >
        <AddStockFormFields products={products} />
      </FormDialog>
    </div>
  );
}
