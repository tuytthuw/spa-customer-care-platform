"use client";

import { useEffect, useState } from "react";
import { mockCustomers } from "@/lib/mock-data";
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

// Định nghĩa kiểu dữ liệu cho form values
interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
}

// Mô phỏng việc gọi API
async function getCustomers(): Promise<Customer[]> {
  return Promise.resolve(mockCustomers);
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      const data = await getCustomers();
      setCustomers(data);
      setIsLoading(false);
    };
    loadCustomers();
  }, []);

  const handleAddCustomer = (data: CustomerFormValues) => {
    const newCustomer: Customer = {
      id: `cus-${Date.now()}`, // Tạo ID duy nhất đơn giản cho dữ liệu giả
      ...data,
      totalAppointments: 0,
      lastVisit: new Date().toISOString(),
    };
    // Thêm khách hàng mới vào đầu danh sách để dễ thấy
    setCustomers((prev) => [newCustomer, ...prev]);
    console.log("Đã thêm khách hàng mới:", newCustomer);
  };

  if (isLoading) {
    return <div>Đang tải danh sách khách hàng...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Khách hàng</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Thêm khách hàng mới</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo hồ sơ khách hàng mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết để thêm một khách hàng mới vào hệ thống.
              </DialogDescription>
            </DialogHeader>
            <AddCustomerForm
              onFormSubmit={handleAddCustomer}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={customers} />
    </div>
  );
}
