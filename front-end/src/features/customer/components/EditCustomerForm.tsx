"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import {} from "@/features/customer/types";

import {
  customerFormSchema,
  CustomerFormValues,
} from "@/features/customer/schemas";
import { FullCustomerProfile } from "@/features/customer/types";
import { ImageUploader } from "@/components/ui/ImageUploader";
interface EditCustomerFormProps {
  initialData: FullCustomerProfile;
  onFormSubmit: (data: CustomerFormValues) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function EditCustomerForm({
  initialData,
  onFormSubmit,
  onClose,
  isSubmitting,
}: EditCustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      notes: initialData.notes || "",
      avatar: undefined,
    },
  });

  useEffect(() => {
    // Reset form với dữ liệu ban đầu, nhưng không reset file đã chọn
    form.reset({
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      notes: initialData.notes,
    });
  }, [initialData, form]);

  function onSubmit(data: CustomerFormValues) {
    onFormSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto -m-6">
          {/* Các trường input giữ nguyên */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập các thông tin cần lưu ý..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 4. Thêm phần upload ảnh đã hoàn thiện */}
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh đại diện (Tùy chọn)</FormLabel>
                <FormControl>
                  <ImageUploader
                    onFileSelect={(file) => field.onChange(file)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
