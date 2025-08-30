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
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  customerFormSchema,
  CustomerFormValues,
} from "@/features/customer/schemas";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false); // 2. Thêm state để theo dõi trạng thái kéo

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
      avatar: undefined,
    },
  });

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      // Optional: Thêm kiểm tra kích thước file hoặc loại file ở đây
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

  // 3. Thêm các hàm xử lý sự kiện kéo thả
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Bắt buộc phải có để sự kiện onDrop hoạt động
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

  function onSubmit(data: CustomerFormValues) {
    console.log("Submitting data:", data);
    console.log("Selected file:", selectedFile);
    onFormSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Các trường name, email, phone, notes giữ nguyên */}
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
                  Email{" "}
                  <span className="text-muted-foreground">(bắt buộc)</span>
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
                  <span className="text-muted-foreground">(bắt buộc)</span>
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

          {/* Phần Upload Ảnh */}
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
              // 4. Thêm các sự kiện kéo thả vào đây
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "mt-1 border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors",
                  isDragging && "border-primary bg-muted/50" // Thêm hiệu ứng khi kéo file
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
                  {" "}
                  {/* min-w-0 để flexbox co lại */}
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
            {isSubmitting ? "Đang lưu..." : "Lưu khách hàng"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
