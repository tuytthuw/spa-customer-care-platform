// src/app/(dashboard)/customers/page.tsx (PHIÊN BẢN CUỐI CÙNG)
"use client";

import { useState } from "react";
// 1. Import thêm useMutation và useQueryClient
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Customer } from "@/types/customer";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddCustomerForm from "@/components/forms/AddCustomerForm";
// 2. Import thêm hàm addCustomer
import { getCustomers, addCustomer } from "@/services/customerService";

interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
}

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // 3. Khởi tạo Query Client
  const queryClient = useQueryClient();

  // Query để lấy dữ liệu (giữ nguyên)
  const {
    data: customers = [],
    isLoading,
    error,
  } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  // 4. Tạo mutation để xử lý việc thêm khách hàng
  const addCustomerMutation = useMutation({
    mutationFn: addCustomer, // Hàm sẽ được gọi khi mutation được trigger
    onSuccess: () => {
      // 🚀 Phép màu xảy ra ở đây!
      // Sau khi thêm thành công, làm vô hiệu (invalidate) cache của query 'customers'
      // React Query sẽ tự động fetch lại dữ liệu mới nhất.
      console.log(
        "Customer added successfully! Invalidating customers query..."
      );
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsDialogOpen(false); // Đóng dialog sau khi thành công
    },
    onError: (error) => {
      // Xử lý lỗi (ví dụ: hiển thị thông báo)
      console.error("Failed to add customer:", error);
      alert("Thêm khách hàng thất bại!");
    },
  });

  // 5. Cập nhật hàm handleAddCustomer để trigger mutation
  const handleAddCustomer = (data: CustomerFormValues) => {
    addCustomerMutation.mutate(data); // Gọi mutation với dữ liệu từ form
  };

  // ... (xử lý isLoading, error giữ nguyên) ...

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Khách hàng</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Thêm khách hàng mới</Button>
          </DialogTrigger>
          <DialogContent>
            {/* ... */}
            <AddCustomerForm
              onFormSubmit={handleAddCustomer}
              onClose={() => setIsDialogOpen(false)}
              // 6. Thêm prop để vô hiệu hóa form khi đang submit
              isSubmitting={addCustomerMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={customers} />
    </div>
  );
}
