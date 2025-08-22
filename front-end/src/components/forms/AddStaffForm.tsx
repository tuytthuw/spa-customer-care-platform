"use client";

import { useForm, Controller } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { mockServices } from "@/lib/mock-data"; // Lấy danh sách dịch vụ
import { UploadCloud } from "lucide-react";

const ROLES = ["technician", "receptionist", "manager"] as const;
const STATUSES = ["active", "inactive"] as const;

// Zod schema mới
const staffFormSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự."),
  email: z.string().email("Email không hợp lệ."),
  phone: z.string().min(10, "Số điện thoại không hợp lệ."),
  role: z.enum(ROLES, { message: "Vui lòng chọn vai trò." }),
  status: z.enum(STATUSES, { message: "Vui lòng chọn trạng thái." }),
  serviceIds: z.array(z.string()).optional(), // Mảng chứa ID các dịch vụ
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
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "technician",
      status: "active",
      serviceIds: [],
    },
  });

  const selectedRole = form.watch("role");

  function onSubmit(data: StaffFormValues) {
    // Nếu không phải KTV, xóa danh sách dịch vụ để tránh gửi dữ liệu thừa
    if (data.role !== "technician") {
      data.serviceIds = [];
    }
    onFormSubmit(data);
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* ... các trường name, email, phone giữ nguyên ... */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ và tên{" "}
                  <span className="text-muted-foreground">(bắt buộc)</span>
                </FormLabel>
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
                <FormLabel>
                  Email{" "}
                  <span className="text-muted-foreground">(bắt buộc)</span>
                </FormLabel>
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
                <FormLabel>
                  Số điện thoại{" "}
                  <span className="text-muted-foreground">(bắt buộc)</span>
                </FormLabel>
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
                <FormLabel>
                  Vai trò{" "}
                  <span className="text-muted-foreground">(bắt buộc)</span>
                </FormLabel>
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

          {/* Hiển thị danh sách dịch vụ khi vai trò là Kỹ thuật viên */}
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
                    {mockServices.map((service) => (
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

          {/* Trạng thái */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="statusActive"
                      name="status"
                      className="h-4 w-4 text-primary border-border"
                      value="active"
                      onChange={field.onChange}
                      checked={field.value === "active"}
                    />
                    <label
                      htmlFor="statusActive"
                      className="ml-2 text-sm text-foreground"
                    >
                      Đang hoạt động
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="statusInactive"
                      name="status"
                      className="h-4 w-4 text-primary border-border"
                      value="inactive"
                      onChange={field.onChange}
                      checked={field.value === "inactive"}
                    />
                    <label
                      htmlFor="statusInactive"
                      className="ml-2 text-sm text-foreground"
                    >
                      Tạm nghỉ
                    </label>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Hình ảnh */}
          <div>
            <FormLabel>Ảnh đại diện</FormLabel>
            <div className="mt-1 border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center">
              <div className="text-muted-foreground text-center">
                <UploadCloud className="text-3xl mb-2 mx-auto" />
                <p>Kéo và thả hình ảnh vào đây hoặc</p>
                <Button type="button" variant="secondary" className="mt-2">
                  Chọn tệp
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, GIF tối đa 2MB
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Lưu nhân viên
          </Button>
        </div>
      </form>
    </Form>
  );
}
