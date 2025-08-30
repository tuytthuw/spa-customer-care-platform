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
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Staff } from "@/features/staff/types"; // 1. Import Staff type

const ROLES = ["technician", "receptionist", "manager"] as const;
const STATUSES = ["active", "inactive"] as const;

// Schema validation giữ nguyên
const staffFormSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự."),
  email: z.string().email("Email không hợp lệ."),
  phone: z.string().regex(/(0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: "Số điện thoại không hợp lệ.",
  }),
  role: z.enum(ROLES, { message: "Vui lòng chọn vai trò." }),
  status: z.enum(STATUSES, { message: "Vui lòng chọn trạng thái." }),
  serviceIds: z.array(z.string()).optional(),
  avatar: z.any().optional(),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

// 2. Cập nhật Props để nhận dữ liệu ban đầu
interface EditStaffFormProps {
  initialData: Staff;
  onFormSubmit: (data: StaffFormValues) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function EditStaffForm({
  initialData,
  onFormSubmit,
  onClose,
  isSubmitting,
}: EditStaffFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    // 3. Điền dữ liệu ban đầu vào form
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      role: initialData.role || "technician",
      status: initialData.status || "active",
      serviceIds: initialData.serviceIds || [],
      avatar: undefined,
    },
  });

  const selectedRole = form.watch("role");

  // 4. Reset form khi đối tượng nhân viên thay đổi
  useEffect(() => {
    form.reset({
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      role: initialData.role,
      status: initialData.status,
      serviceIds: initialData.serviceIds,
    });
  }, [initialData, form]);

  // --- Logic xử lý file (giữ nguyên) ---
  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      setSelectedFile(file);
      form.setValue("avatar", file, { shouldValidate: true });
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0]);
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    form.setValue("avatar", undefined, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    handleFileSelect(file);
  };
  // --- Kết thúc logic xử lý file ---

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

          {/* Phần upload ảnh */}
          <div>
            <FormLabel>Ảnh đại diện (Tùy chọn)</FormLabel>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "mt-1 border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors",
                  isDragging && "border-primary bg-muted/50"
                )}
              >
                <div className="text-muted-foreground text-center">
                  <UploadCloud className="text-3xl mb-2 mx-auto" />
                  <p>Nhấp để chọn ảnh mới hoặc kéo thả vào đây</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, GIF tối đa 2MB
                </p>
              </div>
            ) : (
              <div className="mt-2 flex items-start justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-start gap-2 min-w-0">
                  <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium break-all">
                    {selectedFile.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
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
