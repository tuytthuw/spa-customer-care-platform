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

// Schema để validation
const serviceFormSchema = z.object({
  name: z.string().min(3, "Tên dịch vụ phải có ít nhất 3 ký tự."),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự."),
  category: z.string().min(2, "Danh mục không được để trống."),
  price: z.coerce.number().min(0, "Giá phải là một số dương."),
  duration: z.coerce.number().int().min(5, "Thời lượng phải ít nhất 5 phút."),
  imageUrl: z
    .string()
    .url("URL hình ảnh không hợp lệ.")
    .optional()
    .or(z.literal("")),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface AddServiceFormProps {
  onFormSubmit: (data: ServiceFormValues) => void;
  onClose: () => void;
}

export default function AddServiceForm({
  onFormSubmit,
  onClose,
}: AddServiceFormProps) {
  const form = useForm({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      duration: 30,
      imageUrl: "",
    },
  });

  function onSubmit(data: ServiceFormValues) {
    onFormSubmit(data);
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên dịch vụ</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá (VND)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    // SỬA LỖI: Chuyển đổi giá trị sang số một cách an toàn
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber || 0)
                    }
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời lượng (phút)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="30"
                    {...field}
                    // SỬA LỖI: Chuyển đổi giá trị sang số một cách an toàn
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber || 0)
                    }
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Hình ảnh (Tùy chọn)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com/image.jpg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">Lưu dịch vụ</Button>
        </div>
      </form>
    </Form>
  );
}
