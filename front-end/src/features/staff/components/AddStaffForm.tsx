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
import { mockServices } from "@/lib/mock-data";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ROLES = ["technician", "receptionist", "manager"] as const;
const STATUSES = ["active", "inactive"] as const;

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

interface AddStaffFormProps {
  onFormSubmit: (data: StaffFormValues) => void;
  onClose: () => void;
}

export default function AddStaffForm({
  onFormSubmit,
  onClose,
}: AddStaffFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
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

  function onSubmit(data: StaffFormValues) {
    if (data.role !== "technician") {
      data.serviceIds = [];
    }
    console.log("Submitting staff data:", data);
    onFormSubmit(data);
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* ... các trường khác giữ nguyên ... */}
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
          {/* Hình ảnh */}
          <div>
            <FormLabel>Ảnh đại diện</FormLabel>
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
                  <p>Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
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
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">Lưu nhân viên</Button>
        </div>
      </form>
    </Form>
  );
}
