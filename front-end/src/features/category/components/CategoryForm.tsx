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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categoryFormSchema,
  CategoryFormValues,
} from "@/features/category/schemas";
import { Category } from "../types";

interface CategoryFormProps {
  initialData?: Category | null;
  onFormSubmit: (data: CategoryFormValues) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function CategoryForm({
  initialData,
  onFormSubmit,
  onClose,
  isSubmitting,
}: CategoryFormProps) {
  const isEditMode = !!initialData;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || {
      name: "",
      type: "service", // Mặc định là 'service' khi tạo mới
    },
  });

  const processSubmit = (data: CategoryFormValues) => {
    // Chuẩn hóa tên danh mục: Viết hoa chữ cái đầu, xóa khoảng trắng thừa
    const normalizedData = {
      ...data,
      name:
        data.name.trim().charAt(0).toUpperCase() + data.name.trim().slice(1),
    };
    onFormSubmit(normalizedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(processSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="service">Dịch vụ</SelectItem>
                  <SelectItem value="product">Sản phẩm</SelectItem>
                  <SelectItem value="treatment">Liệu trình</SelectItem>
                </SelectContent>
              </Select>
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
            {isSubmitting ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
