"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Textarea } from "@/features/shared/components/ui/textarea";

export default function LogStatusFormFields() {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ghi chú của kỹ thuật viên</FormLabel>
          <FormControl>
            <Textarea
              rows={6}
              placeholder="Ví dụ: Da khách hàng có cải thiện, vùng má giảm mụn, cần cấp ẩm thêm..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
