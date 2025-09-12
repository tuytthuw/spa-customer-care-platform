"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FullCustomerProfile } from "@/features/customer/types";
import {
  customerFormSchema,
  CustomerFormValues,
} from "@/features/customer/schemas";
import {
  addCustomer,
  updateCustomer,
  updateCustomerStatus,
} from "@/features/customer/api/customer.api";
import { useCustomers } from "@/features/customer/hooks/useCustomers";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/common/PageHeader";
import { FormDialog } from "@/components/common/FormDialog";
import { columns } from "./columns";
import { toast } from "sonner";
import CustomerFormFields from "@/features/customer/components/CustomerForm"; // Đổi tên import
import { FullPageLoader } from "@/components/ui/spinner";

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<FullCustomerProfile | null>(null);
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading, error } = useCustomers();

  // Khởi tạo form ở đây để FormDialog có thể sử dụng
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
  });

  // Cập nhật giá trị mặc định của form mỗi khi dialog được mở
  useEffect(() => {
    if (isDialogOpen) {
      if (editingCustomer) {
        form.reset(editingCustomer);
      } else {
        form.reset({
          name: "",
          email: "",
          phone: "",
          notes: "",
          avatar: undefined,
        });
      }
    }
  }, [isDialogOpen, editingCustomer, form]);

  const handleMutationSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    setIsDialogOpen(false);
    setEditingCustomer(null);
    toast.success(message);
  };

  const addCustomerMutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => handleMutationSuccess("Thêm khách hàng thành công!"),
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string;
      data: CustomerFormValues;
    }) => updateCustomer(customerId, data),
    onSuccess: () => handleMutationSuccess("Cập nhật khách hàng thành công!"),
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      userId,
      newStatus,
    }: {
      userId: string;
      newStatus: "active" | "inactive";
    }) => updateCustomerStatus(userId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (err) => toast.error(`Cập nhật thất bại: ${err.message}`),
  });

  const handleOpenDialog = (customer: FullCustomerProfile | null = null) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (data: CustomerFormValues) => {
    if (editingCustomer) {
      updateCustomerMutation.mutate({ customerId: editingCustomer.id, data });
    } else {
      addCustomerMutation.mutate(data);
    }
  };

  const handleUpdateStatus = (
    userId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateStatusMutation.mutate({ userId, newStatus });
  };

  if (isLoading)
    return <FullPageLoader text="Đang tải danh sách khách hàng..." />;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="p-6 bg-muted min-h-full">
      <PageHeader
        title="Quản lý khách hàng"
        actionNode={
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm khách hàng
          </Button>
        }
      />

      <DataTable
        columns={columns({
          onUpdateStatus: handleUpdateStatus,
          onEdit: handleOpenDialog,
        })}
        data={customers}
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={
          editingCustomer
            ? `Chỉnh sửa: ${editingCustomer.name}`
            : "Thêm khách hàng mới"
        }
        form={form}
        onFormSubmit={handleFormSubmit}
        isSubmitting={
          addCustomerMutation.isPending || updateCustomerMutation.isPending
        }
        submitText={editingCustomer ? "Lưu thay đổi" : "Thêm mới"}
      >
        <CustomerFormFields />
      </FormDialog>
    </div>
  );
}
