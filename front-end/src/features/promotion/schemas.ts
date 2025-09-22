import { z } from "zod";
import { nameSchema, descriptionSchema, imageFileSchema } from "@/lib/schemas";

export const promotionFormSchema = z.object({
  title: nameSchema.min(5, "Tiêu đề cần ít nhất 5 ký tự."),
  description: descriptionSchema,
  discountPercent: z
    .number()
    .min(0, "Tỷ lệ giảm giá không được âm.")
    .max(100, "Tỷ lệ giảm giá không được lớn hơn 100."),
  startDate: z.date(),
  endDate: z.date(),
  applicableServiceIds: z.array(z.string()).optional(),
  applicablePlanIds: z.array(z.string()).optional(),
  giftProductIds: z.array(z.string()).optional(),
  imageFile: imageFileSchema,
});

export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
