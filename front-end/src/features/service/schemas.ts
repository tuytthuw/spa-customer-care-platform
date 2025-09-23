// src/features/service/schemas.ts
import { z } from "zod";
import {
  nameSchema,
  descriptionSchema,
  priceSchema,
  imageFileSchema,
} from "@/lib/schemas";

const serviceConsumableSchema = z.object({
  productId: z.string().min(1, "Vui lòng chọn một sản phẩm."),
  quantityUsed: z.number().min(0.01, "Số lượng phải lớn hơn 0."),
});

export const serviceFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  categories: z.array(z.string()).optional(),
  price: priceSchema,
  duration: z.number().int().min(5, "Thời lượng phải ít nhất 5 phút."),
  imageFile: imageFileSchema,
  imageFiles: z.array(z.any()).optional(),
  consumables: z.array(serviceConsumableSchema).optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
