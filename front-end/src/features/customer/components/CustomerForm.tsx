"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { ImageUploader } from "@/features/shared/components/ui/ImageUploader";

/**
 * Component này chỉ chứa các trường nhập liệu cho form khách hàng.
 * Nó sẽ được đặt bên trong component `FormDialog` để hiển thị.
 */
export default function CustomerFormFields() {
  return (
    <>
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Họ và tên</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nguyễn Văn A" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} placeholder="email@example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số điện thoại</FormLabel>
            <FormControl>
              <Input {...field} placeholder="09xxxxxxxx" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
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
      <FormField
        name="avatar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ảnh đại diện (Tùy chọn)</FormLabel>
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
