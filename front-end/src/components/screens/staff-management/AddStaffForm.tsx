"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = ["technician", "receptionist", "manager"] as const;

const staffFormSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự."),
  email: z.string().email("Email không hợp lệ."),
  phone: z.string().min(10, "Số điện thoại không hợp lệ."),
  role: z.enum(ROLES, { message: "Vui lòng chọn vai trò." }),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface AddStaffFormProps {
  onFormSubmit: (data: StaffFormValues) => void;
  onClose: () => void;
}

export default function AddStaffForm({
  onFormSubmit,
  onClose,
}: AddStaffFormProps) {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
  });

  function onSubmit(data: StaffFormValues) {
    onFormSubmit(data);
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                <Input type="email" {...field} />
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vai trò</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò cho nhân viên" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="technician">Kỹ thuật viên</SelectItem>
                  <SelectItem value="receptionist">Lễ tân</SelectItem>
                  <SelectItem value="manager">Quản lý</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">Lưu nhân viên</Button>
        </div>
      </form>
    </Form>
  );
}
