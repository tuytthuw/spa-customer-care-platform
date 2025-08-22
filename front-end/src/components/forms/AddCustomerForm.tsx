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
import { z } from "zod";
import { UploadCloud } from "lucide-react";

// Định nghĩa schema validation
const customerFormSchema = z.object({
  name: z.string().min(3, { message: "Tên phải có ít nhất 3 ký tự." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ." }),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface AddCustomerFormProps {
  onFormSubmit: (data: CustomerFormValues) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function AddCustomerForm({
  onFormSubmit,
  onClose,
  isSubmitting,
}: AddCustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  function onSubmit(data: CustomerFormValues) {
    onFormSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ và tên <span className="text-neutral-500">(bắt buộc)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ tên khách hàng" {...field} />
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
                <FormLabel>
                  Email <span className="text-neutral-500">(bắt buộc)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
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
                <FormLabel>
                  Số điện thoại{" "}
                  <span className="text-neutral-500">(bắt buộc)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
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
                    placeholder="Nhập các thông tin cần lưu ý về khách hàng..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hình ảnh */}
          <div>
            <FormLabel>Ảnh đại diện</FormLabel>
            <div className="mt-1 border-2 border-dashed border-neutral-300 rounded-md p-6 flex flex-col items-center justify-center">
              <div className="text-neutral-500 text-center">
                <UploadCloud className="text-3xl mb-2 mx-auto" />
                <p>Kéo và thả hình ảnh vào đây hoặc</p>
                <Button type="button" variant="secondary" className="mt-2">
                  Chọn tệp
                </Button>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                PNG, JPG, GIF tối đa 2MB
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-neutral-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white hover:bg-neutral-800"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu khách hàng"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
