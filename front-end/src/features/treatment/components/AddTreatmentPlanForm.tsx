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
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Schema validation cho liệu trình
const treatmentPlanFormSchema = z.object({
  name: z.string().trim().min(3, "Tên liệu trình phải có ít nhất 3 ký tự."),
  description: z
    .string()
    .trim()
    .min(10, "Mô tả phải có ít nhất 10 ký tự.")
    .optional(),
  price: z.number().min(0, "Giá phải là một số dương."),
  totalSessions: z.number().int().min(1, "Số buổi phải ít nhất là 1."),
  imageFile: z.any().optional(),
});

type TreatmentPlanFormValues = z.infer<typeof treatmentPlanFormSchema>;

interface AddTreatmentPlanFormProps {
  onFormSubmit: (data: TreatmentPlanFormValues) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function AddTreatmentPlanForm({
  onFormSubmit,
  onClose,
  isSubmitting,
}: AddTreatmentPlanFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [displayPrice, setDisplayPrice] = useState("");

  const form = useForm<TreatmentPlanFormValues>({
    resolver: zodResolver(treatmentPlanFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      totalSessions: 5,
      imageFile: undefined,
    },
  });

  // --- Logic xử lý file ---
  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      setSelectedFile(file);
      form.setValue("imageFile", file, { shouldValidate: true });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0]);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    form.setValue("imageFile", undefined, { shouldValidate: true });
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numberValue = parseInt(rawValue, 10) || 0;
    form.setValue("price", numberValue * 1000, { shouldValidate: true });
    setDisplayPrice(new Intl.NumberFormat("vi-VN").format(numberValue));
  };

  function onSubmit(data: TreatmentPlanFormValues) {
    onFormSubmit(data);
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto -m-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên liệu trình{" "}
                  <span className="text-muted-foreground">(bắt buộc)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ví dụ: Liệu trình triệt lông vĩnh viễn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả chi tiết về liệu trình"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Giá liệu trình{" "}
                    <span className="text-muted-foreground">(bắt buộc)</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Nhập giá (ví dụ: 500 cho 500.000đ)"
                        className="pr-12"
                        value={displayPrice}
                        onChange={handlePriceChange}
                      />
                    </FormControl>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-muted-foreground">VND</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalSessions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tổng số buổi{" "}
                    <span className="text-muted-foreground">(bắt buộc)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Hình ảnh liệu trình</FormLabel>
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
                  PNG, JPG, GIF tối đa 5MB
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
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu liệu trình"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
