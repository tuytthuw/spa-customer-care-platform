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
import { getCustomers, addCustomer } from "@/services/customerService";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Plus,
  UserCheck,
  Bell,
  CalendarPlus,
  BarChart,
} from "lucide-react";
import CustomerCard from "@/components/screens/customers/CustomerCard"; // Component mới

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
    // Logic thêm khách hàng ở đây
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

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded border border-neutral-200 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            </div>
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tất cả dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả dịch vụ</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-neutral-100 text-neutral-700">
            <Filter className="mr-2 h-4 w-4" /> Lọc
          </Button>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="bg-neutral-100 p-4 h-auto flex-col gap-2 hover:bg-neutral-200"
          >
            <UserCheck className="w-6 h-6" />{" "}
            <span className="text-sm">Check-in hàng loạt</span>
          </Button>
          <Button
            variant="outline"
            className="bg-neutral-100 p-4 h-auto flex-col gap-2 hover:bg-neutral-200"
          >
            <Bell className="w-6 h-6" />{" "}
            <span className="text-sm">Gửi thông báo</span>
          </Button>
          <Button
            variant="outline"
            className="bg-neutral-100 p-4 h-auto flex-col gap-2 hover:bg-neutral-200"
          >
            <CalendarPlus className="w-6 h-6" />{" "}
            <span className="text-sm">Đặt lịch mới</span>
          </Button>
          <Button
            variant="outline"
            className="bg-neutral-100 p-4 h-auto flex-col gap-2 hover:bg-neutral-200"
          >
            <BarChart className="w-6 h-6" />{" "}
            <span className="text-sm">Xem báo cáo</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
