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
import { useState } from "react";
import { Category } from "@/features/category/types";
import {
  treatmentPlanFormSchema,
  TreatmentPlanFormValues,
} from "@/features/treatment/schemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  addCategory,
} from "@/features/category/api/category.api";
import AddCategoryForm from "@/features/category/components/AddCategoryForm";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-dropdown-menu";
interface AddTreatmentPlanFormProps {
  onFormSubmit: (data: TreatmentPlanFormValues) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}
import { ImageUploader } from "@/components/ui/ImageUploader";

export default function AddTreatmentPlanForm({
  onFormSubmit,
  onClose,
  isSubmitting,
}: AddTreatmentPlanFormProps) {
  const queryClient = useQueryClient();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [displayPrice, setDisplayPrice] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories", "treatment"],
    queryFn: () =>
      getCategories().then((data) =>
        data.filter((c) => c.type === "treatment")
      ),
  });

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ["categories", "treatment"] });
      toast.success(`Đã thêm danh mục "${newCategory.name}"!`);
      // Tự động chọn danh mục vừa thêm
      const currentCategories = form.getValues("categories") || [];
      form.setValue("categories", [...currentCategories, newCategory.name]);
      setIsAddCategoryOpen(false);
    },
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  const form = useForm<TreatmentPlanFormValues>({
    resolver: zodResolver(treatmentPlanFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categories: [],
      price: 0,
      totalSessions: 5,
      imageFile: undefined,
    },
  });

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
                      <span className="text-muted-foreground">.000 VND</span>
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
                <FormLabel>Hình ảnh liệu trình (Tùy chọn)</FormLabel>
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
