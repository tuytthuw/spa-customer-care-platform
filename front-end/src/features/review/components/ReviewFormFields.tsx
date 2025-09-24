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
import StarRating from "@/features/review/components/StarRating";
import { MultiImageUploader } from "@/features/shared/components/ui/MultiImageUploader";

export default function ReviewFormFields() {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Xếp hạng của bạn</FormLabel>
            <FormControl>
              <StarRating
                rating={field.value}
                onRatingChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nhận xét của bạn</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Dịch vụ tuyệt vời, nhân viên chuyên nghiệp..."
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="imageFiles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thêm ảnh minh họa (tùy chọn)</FormLabel>
            <FormControl>
              <MultiImageUploader
                onFilesSelect={(files) => field.onChange(files)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
