// src/features/category/components/AddCategoryForm.tsx
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
  categoryFormSchema,
  CategoryFormValues,
} from "@/features/category/schemas";
import { Category } from "../types";

interface AddCategoryFormProps {
  categoryType: Category["type"];
  onFormSubmit: (data: CategoryFormValues) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function AddCategoryForm({
  categoryType,
  onFormSubmit,
  onClose,
  isSubmitting,
}: AddCategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      type: categoryType,
    },
  });

  const processSubmit = (data: CategoryFormValues) => {
    onFormSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Ngăn hành vi mặc định của form
          e.stopPropagation(); // Ngăn sự kiện lan tỏa lên các form cha
          form.handleSubmit(processSubmit)(); // Chỉ gọi hàm submit của form này
        }}
        className="space-y-4 pt-4"
      >
        {" "}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục mới</FormLabel>
              <FormControl>
                <Input placeholder="VD: Chăm sóc da chuyên sâu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại danh mục</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
