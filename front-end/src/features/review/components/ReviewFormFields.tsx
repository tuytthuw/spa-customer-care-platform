"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/features/review/components/StarRating";

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
    </>
  );
}
