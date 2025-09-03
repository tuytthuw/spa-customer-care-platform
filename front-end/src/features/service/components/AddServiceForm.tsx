"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  UploadCloud,
  File as FileIcon,
  X,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  serviceFormSchema,
  ServiceFormValues,
} from "@/features/service/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  addCategory,
} from "@/features/category/api/category.api";
import AddCategoryForm from "@/features/category/components/AddCategoryForm";
import { Category } from "@/features/category/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface AddServiceFormProps {
  onFormSubmit: (data: ServiceFormValues) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function AddServiceForm({
  onFormSubmit,
  onClose,
  isSubmitting,
}: AddServiceFormProps) {
  const queryClient = useQueryClient();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [displayPrice, setDisplayPrice] = useState("");

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categories: [],
      price: 0,
      duration: 30,
      imageFile: undefined,
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories", "service"],
    queryFn: () =>
      getCategories().then((data) => data.filter((c) => c.type === "service")),
  });

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ["categories", "service"] });
      toast.success(`Đã thêm danh mục "${newCategory.name}"!`);
      // Tự động chọn danh mục vừa thêm
      const currentCategories = form.getValues("categories") || [];
      form.setValue("categories", [...currentCategories, newCategory.name]);
      setIsAddCategoryOpen(false);
    },
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
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

  // 3. Logic xử lý định dạng giá tiền
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Chỉ giữ lại số
    const numberValue = parseInt(rawValue, 10) || 0;

    // Cập nhật giá trị thật cho form (nhân với 1000)
    form.setValue("price", numberValue * 1000, { shouldValidate: true });

    // Cập nhật giá trị hiển thị đã được định dạng
    setDisplayPrice(new Intl.NumberFormat("vi-VN").format(numberValue));
  };

  function onSubmit(data: ServiceFormValues) {
    onFormSubmit(data);
    onClose();
  }

  const selectedCategories = form.watch("categories") || [];

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
                  Tên dịch vụ{" "}
                  <span className="text-muted-foreground">(bắt buộc)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên dịch vụ" {...field} />
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
                    placeholder="Nhập mô tả chi tiết về dịch vụ"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-auto min-h-9"
                      >
                        <div className="flex gap-1 flex-wrap">
                          {selectedCategories.length > 0
                            ? selectedCategories.map((catName) => (
                                <Badge key={catName} variant="secondary">
                                  {catName}
                                </Badge>
                              ))
                            : "Chọn danh mục..."}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <div className="p-2 space-y-1">
                      {categories.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="categories"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category.name)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          category.name,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== category.name
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    {/* Nút thêm nhanh danh mục */}
                    <Separator />
                    <Dialog
                      open={isAddCategoryOpen}
                      onOpenChange={setIsAddCategoryOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-t-none"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm danh mục mới
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tạo danh mục dịch vụ mới</DialogTitle>
                        </DialogHeader>
                        <AddCategoryForm
                          categoryType="service"
                          onFormSubmit={(data) =>
                            addCategoryMutation.mutate(data)
                          }
                          onClose={() => setIsAddCategoryOpen(false)}
                          isSubmitting={addCategoryMutation.isPending}
                        />
                      </DialogContent>
                    </Dialog>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 4. Cập nhật trường giá dịch vụ */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giá dịch vụ{" "}
                    <span className="text-muted-foreground">(bắt buộc)</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Nhập giá"
                        className="pr-12"
                        value={displayPrice}
                        onChange={handlePriceChange}
                      />
                    </FormControl>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-muted-foreground">.000 VND</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Thời lượng{" "}
                    <span className="text-muted-foreground">(bắt buộc)</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="pr-14"
                        {...field}
                        onChange={(e) => {
                          // Giữ lại giá trị chuỗi để xử lý, chỉ chuyển đổi khi cần
                          const valueAsString = e.target.value;
                          // Chuyển đổi sang số để validate và lưu trữ
                          const valueAsNumber = parseInt(valueAsString, 10);
                          field.onChange(
                            isNaN(valueAsNumber) ? "" : valueAsNumber
                          );
                        }}
                      />
                    </FormControl>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-muted-foreground">phút</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Hình ảnh dịch vụ</FormLabel>
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

          <div>
            <FormLabel>Trạng thái</FormLabel>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="statusActive"
                  name="status"
                  className="h-4 w-4 text-primary border-border"
                  defaultChecked
                />
                <label
                  htmlFor="statusActive"
                  className="ml-2 text-sm text-foreground"
                >
                  Hiện
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="statusHidden"
                  name="status"
                  className="h-4 w-4 text-primary border-border"
                />
                <label
                  htmlFor="statusHidden"
                  className="ml-2 text-sm text-foreground"
                >
                  Ẩn
                </label>
              </div>
            </div>
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
            {isSubmitting ? "Đang lưu..." : "Lưu dịch vụ"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
