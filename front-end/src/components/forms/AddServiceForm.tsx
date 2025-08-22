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
import { UploadCloud } from "lucide-react"; // Giả sử bạn có icon này

// Schema: KHÔNG dùng coerce / preprocess để tránh mismatch input/output
const serviceFormSchema = z.object({
  name: z.string().trim().min(3, "Tên dịch vụ phải có ít nhất 3 ký tự."),
  description: z
    .string()
    .trim()
    .min(10, "Mô tả phải có ít nhất 10 ký tự.")
    .optional(),
  category: z.string().trim().min(2, "Danh mục không được để trống."),
  price: z.number().min(0, "Giá phải là một số dương."),
  duration: z.number().int().min(5, "Thời lượng phải ít nhất 5 phút."),
  imageUrl: z
    .union([z.string().url("URL hình ảnh không hợp lệ."), z.literal("")])
    .optional(),
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
  const form = useForm<ServiceFormValues>({
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        {/* Tên dịch vụ */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên dịch vụ <span className="text-neutral-500">(bắt buộc)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên dịch vụ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mô tả */}
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

        {/* Giá và Thời lượng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Giá dịch vụ{" "}
                  <span className="text-neutral-500">(bắt buộc)</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="pr-12"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-neutral-500">VND</span>
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
                  <span className="text-neutral-500">(bắt buộc)</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="pr-14"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-neutral-500">phút</span>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Hình ảnh dịch vụ (Giao diện mẫu) */}
        <div>
          <FormLabel>Hình ảnh dịch vụ</FormLabel>
          <div className="mt-1 border-2 border-dashed border-neutral-300 rounded-md p-6 flex flex-col items-center justify-center">
            <div className="text-neutral-500 text-center">
              <UploadCloud className="text-3xl mb-2 mx-auto" />
              <p>Kéo và thả hình ảnh vào đây hoặc</p>
              <Button type="button" variant="secondary" className="mt-2">
                Chọn tệp
              </Button>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              PNG, JPG, GIF tối đa 5MB
            </p>
          </div>
        </div>

        {/* Trạng thái (Giao diện mẫu) */}
        <div>
          <FormLabel>Trạng thái</FormLabel>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center">
              <input
                type="radio"
                id="statusActive"
                name="status"
                className="h-4 w-4 text-black border-neutral-300"
                defaultChecked
              />
              <label
                htmlFor="statusActive"
                className="ml-2 text-sm text-neutral-700"
              >
                Hiện
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="statusHidden"
                name="status"
                className="h-4 w-4 text-black border-neutral-300"
              />
              <label
                htmlFor="statusHidden"
                className="ml-2 text-sm text-neutral-700"
              >
                Ẩn
              </label>
            </div>
          </div>
        </div>

        {/* Nút bấm */}
        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 -mx-6 -mb-6 px-4 py-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-black text-white hover:bg-neutral-800"
          >
            Lưu dịch vụ
          </Button>
        </div>
      </form>
    </Form>
  );
}
