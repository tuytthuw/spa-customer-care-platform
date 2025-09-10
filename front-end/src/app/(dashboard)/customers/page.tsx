"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FullCustomerProfile } from "@/features/customer/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomerForm from "@/features/customer/components/CustomerForm";
import {
  addCustomer,
  updateCustomerStatus,
  updateCustomer,
} from "@/features/customer/api/customer.api"; // 2. Import hàm updateCustomer
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { useCustomers } from "@/features/customer/hooks/useCustomers";

// Lấy type từ Zod schema
type CustomerFormValues = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
};

export default function CustomersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<FullCustomerProfile | null>(null);

  const queryClient = useQueryClient();

  const { data: customers = [], isLoading, error } = useCustomers();

  // Mutation để thêm
  const addCustomerMutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsAddDialogOpen(false);
      toast.success("Thêm khách hàng thành công!");
    },
    onError: (error) => {
      toast.error(`Thêm khách hàng thất bại: ${error.message}`);
    },
  });

  // Mutation để cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: ({
      customerId,
      newStatus,
    }: {
      customerId: string;
      newStatus: "active" | "inactive";
    }) => updateCustomerStatus(customerId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cập nhật trạng thái thành công!");
    },
    onError: (error) => {
      toast.error(`Cập nhật trạng thái thất bại: ${error.message}`);
    },
  });

  // Mutation để chỉnh sửa thông tin
  const updateCustomerMutation = useMutation({
    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string;
      data: CustomerFormValues;
    }) => updateCustomer(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsEditDialogOpen(false);
      toast.success("Cập nhật thông tin thành công!");
    },
    onError: (error) => {
      toast.error(`Cập nhật thông tin thất bại: ${error.message}`);
    },
  });

  const handleAddCustomer = (data: CustomerFormValues) => {
    addCustomerMutation.mutate(data);
  };

  const handleUpdateStatus = (
    customerId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateStatusMutation.mutate({ customerId, newStatus });
  };

  // 5. Hàm để mở dialog chỉnh sửa
  const handleEditCustomer = (customer: FullCustomerProfile) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  // 6. Hàm để gọi khi submit form chỉnh sửa
  const handleUpdateCustomer = (data: CustomerFormValues) => {
    if (editingCustomer) {
      updateCustomerMutation.mutate({ customerId: editingCustomer.id, data });
    }
  };

  if (isLoading) return <div>Đang tải danh sách khách hàng...</div>;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="p-6 bg-muted min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý khách hàng</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khách hàng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm khách hàng mới</DialogTitle>
            </DialogHeader>
            <CustomerForm
              onFormSubmit={handleAddCustomer}
              onClose={() => setIsAddDialogOpen(false)}
              isSubmitting={addCustomerMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns({
          onUpdateStatus: handleUpdateStatus,
          onEdit: handleEditCustomer,
        })}
        data={customers}
      />

      {/* 7. Thêm Dialog cho việc chỉnh sửa */}
      {editingCustomer && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Chỉnh sửa thông tin: {editingCustomer.name}
              </DialogTitle>
            </DialogHeader>
            <CustomerForm
              initialData={editingCustomer}
              onFormSubmit={handleUpdateCustomer}
              onClose={() => setIsEditDialogOpen(false)}
              isSubmitting={updateCustomerMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
