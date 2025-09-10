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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import { FullStaffProfile } from "@/features/staff/types";
import { Service } from "@/features/service/types";
import { staffFormSchema, StaffFormValues } from "@/features/staff/schemas";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface StaffFormProps {
  initialData?: FullStaffProfile;
  services: Service[];
  onFormSubmit: (data: StaffFormValues) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function StaffForm({
  initialData,
  services,
  onFormSubmit,
  onClose,
  isSubmitting,
}: StaffFormProps) {
  const isEditMode = !!initialData;

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      role: "technician",
      status: "active",
      serviceIds: [],
      avatar: undefined,
    },
  });

  const selectedRole = form.watch("role");

  useEffect(() => {
    if (isEditMode && initialData) {
      form.reset(initialData);
    }
  }, [initialData, form, isEditMode]);

  function onSubmit(data: StaffFormValues) {
    if (data.role !== "technician") {
      data.serviceIds = [];
    }
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
          {selectedRole === "technician" && (
            <FormField
              control={form.control}
              name="serviceIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Các dịch vụ có thể thực hiện
                    </FormLabel>
                  </div>
                  <div className="space-y-2">
                    {services.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="serviceIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={service.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          service.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== service.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {service.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
            {isSubmitting
              ? "Đang lưu..."
              : isEditMode
              ? "Lưu thay đổi"
              : "Lưu nhân viên"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
