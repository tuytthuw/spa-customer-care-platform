// src/features/product/components/EditProductForm.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "@/features/category/api/category.api";
import AddCategoryForm from "@/features/category/components/AddCategoryForm";
import { toast } from "sonner";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { useState, useEffect } from "react";
import { ProductFormValues } from "../schemas";
import { useCategories } from "@/features/category/hooks/useCategories";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProductFormFields() {
  const form = useFormContext<ProductFormValues>();
  const [displayPrice, setDisplayPrice] = useState(() =>
    form.getValues("price")
      ? new Intl.NumberFormat("vi-VN").format(form.getValues("price") / 1000)
      : ""
  );

  const { data: categories = [] } = useCategories();
  const productCategories = categories.filter((c) => c.type === "product");
  const selectedCategories = form.watch("categories") || [];

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.price !== undefined) {
        const currentNumericPrice =
          parseFloat(displayPrice.replace(/[^0-9]/g, "")) * 1000;
        if (value.price !== currentNumericPrice) {
          setDisplayPrice(
            new Intl.NumberFormat("vi-VN").format(value.price / 1000)
          );
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, displayPrice]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numberValue = parseInt(rawValue, 10) || 0;
    form.setValue("price", numberValue * 1000, { shouldValidate: true });
    setDisplayPrice(new Intl.NumberFormat("vi-VN").format(numberValue));
  };

  const queryClient = useQueryClient();

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ["categories", "product"] });
      toast.success(`Đã thêm danh mục "${newCategory.name}"!`);
      // Tự động chọn danh mục vừa thêm
      const currentCategories = form.getValues("categories") || [];
      form.setValue("categories", [...currentCategories, newCategory.name]);
      setIsAddCategoryOpen(false);
    },
    onError: (err) => toast.error(`Thêm thất bại: ${err.message}`),
  });

  return (
    <>
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên sản phẩm</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea {...field} />
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
                  {productCategories.map((category) => (
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
                                const currentValues = field.value || [];
                                return checked
                                  ? field.onChange([
                                      ...currentValues,
                                      category.name,
                                    ])
                                  : field.onChange(
                                      currentValues.filter(
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
                      <DialogTitle>Tạo danh mục sản phẩm mới</DialogTitle>
                    </DialogHeader>
                    <AddCategoryForm
                      categoryType="product"
                      onFormSubmit={(data) => addCategoryMutation.mutate(data)}
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
              <FormLabel>Giá bán</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
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
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tồn kho</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value, 10) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        name="imageFile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hình ảnh sản phẩm (Tùy chọn)</FormLabel>
            <FormControl>
              <ImageUploader onFileSelect={(file) => field.onChange(file)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
