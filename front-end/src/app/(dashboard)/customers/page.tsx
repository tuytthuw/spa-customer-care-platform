"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerFilters } from "@/features/customer/components/CustomerFilters";
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
import { Mail, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/common/PageHeader";
import { FormDialog } from "@/components/common/FormDialog";
import { columns } from "./columns";
import { toast } from "sonner";
import CustomerFormFields from "@/features/customer/components/CustomerForm"; // Đổi tên import
import { FullPageLoader } from "@/components/ui/spinner";
import { sendBulkEmails } from "@/features/marketing/api/marketing.api";
import {
  marketingEmailSchema,
  MarketingEmailFormValues,
} from "@/features/marketing/schemas";
import MarketingEmailFormFields from "@/features/marketing/components/MarketingEmailForm";

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<FullCustomerProfile | null>(null);
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    name: "",
    status: "all",
  });
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const { data: customers = [], isLoading, error } = useCustomers();

  // Form cho thêm/sửa khách hàng
  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
  });

  // MỚI: Form cho gửi email
  const emailForm = useForm<MarketingEmailFormValues>({
    resolver: zodResolver(marketingEmailSchema),
    defaultValues: { subject: "", content: "" },
  });

  // Cập nhật giá trị mặc định của form mỗi khi dialog được mở
  useEffect(() => {
    if (isDialogOpen) {
      if (editingCustomer) {
        customerForm.reset(editingCustomer);
      } else {
        customerForm.reset({
          name: "",
          email: "",
          phone: "",
          notes: "",
          avatar: undefined,
        });
      }
    }
  }, [isDialogOpen, editingCustomer, customerForm]);

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

  const sendEmailMutation = useMutation({
    mutationFn: sendBulkEmails,
    onSuccess: (data) => {
      toast.success(data.success);
      setIsEmailDialogOpen(false);
      emailForm.reset();
    },
    onError: (err) => toast.error(`Gửi email thất bại: ${err.message}`),
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

  const handleEmailFormSubmit = (data: MarketingEmailFormValues) => {
    sendEmailMutation.mutate({
      recipients: filteredCustomers,
      subject: data.subject,
      content: data.content,
    });
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const nameMatch =
        filters.name.trim() === "" ||
        customer.name.toLowerCase().includes(filters.name.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.name.toLowerCase()) ||
        customer.phone.includes(filters.name);

      const statusMatch =
        filters.status === "all" || customer.status === filters.status;

      return nameMatch && statusMatch;
    });
  }, [customers, filters]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ name: "", status: "all" });
  };

  if (isLoading)
    return <FullPageLoader text="Đang tải danh sách khách hàng..." />;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="p-6 bg-muted min-h-full">
      <PageHeader
        title="Quản lý khách hàng"
        actionNode={
          <div className="flex gap-2">
            {/* MỚI: Nút gửi email marketing */}
            <Button
              variant="outline"
              onClick={() => setIsEmailDialogOpen(true)}
              disabled={filteredCustomers.length === 0}
            >
              <Mail className="mr-2 h-4 w-4" /> Gửi Email (
              {filteredCustomers.length})
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Thêm khách hàng
            </Button>
          </div>
        }
      />
      <CustomerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      <DataTable
        columns={columns({
          onUpdateStatus: handleUpdateStatus,
          onEdit: handleOpenDialog,
        })}
        data={filteredCustomers}
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={
          editingCustomer
            ? `Chỉnh sửa: ${editingCustomer.name}`
            : "Thêm khách hàng mới"
        }
        form={customerForm}
        onFormSubmit={handleFormSubmit}
        isSubmitting={
          addCustomerMutation.isPending || updateCustomerMutation.isPending
        }
        submitText={editingCustomer ? "Lưu thay đổi" : "Thêm mới"}
      >
        <CustomerFormFields />
      </FormDialog>

      <FormDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        title={`Gửi Email Marketing đến ${filteredCustomers.length} khách hàng`}
        description="Soạn và gửi thông điệp của bạn đến danh sách khách hàng đã được lọc."
        form={emailForm}
        onFormSubmit={handleEmailFormSubmit}
        isSubmitting={sendEmailMutation.isPending}
        submitText={sendEmailMutation.isPending ? "Đang gửi..." : "Gửi ngay"}
      >
        <MarketingEmailFormFields />
      </FormDialog>
    </div>
  );
}
