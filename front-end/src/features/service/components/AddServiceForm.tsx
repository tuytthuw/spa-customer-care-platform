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
import { ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
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
import { ImageUploader } from "@/components/ui/ImageUploader";

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

          <FormField
            control={form.control}
            name="imageFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh dịch vụ (Tùy chọn)</FormLabel>
                <FormControl>
                  <ImageUploader
                    onFileSelect={(file) => field.onChange(file)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
