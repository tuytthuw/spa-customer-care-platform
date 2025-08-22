"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddCustomerForm from "@/components/forms/AddCustomerForm";
import { getCustomers } from "@/services/customerService";
import { Plus } from "lucide-react";
import CustomerCard from "@/features/customer/CustomerCard";
import { QuickActions } from "@/features/customer/QuickActions";
import { CustomerFilters } from "@/features/customer/CustomerFilters"; // Import component mới

interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
}

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: customers = [],
    isLoading,
    error,
  } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const handleAddCustomer = (data: CustomerFormValues) => {
    console.log("Adding customer:", data);
    setIsDialogOpen(false);
  };

  if (isLoading) return <div>Đang tải danh sách khách hàng...</div>;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="p-6 bg-neutral-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý khách hàng</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-neutral-800 text-white px-4 py-2 rounded flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Thêm khách hàng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm khách hàng mới</DialogTitle>
            </DialogHeader>
            <AddCustomerForm
              onFormSubmit={handleAddCustomer}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Sử dụng component CustomerFilters đã tách */}
      <CustomerFilters />

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>

      {/* Sử dụng component QuickActions đã tách */}
      <QuickActions />
    </div>
  );
}
