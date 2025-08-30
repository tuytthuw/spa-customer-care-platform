// src/features/service/schemas.ts
import { z } from "zod";
import {
  nameSchema,
  descriptionSchema,
  priceSchema,
  imageFileSchema,
} from "@/lib/schemas"; // <-- Import schema chung

export const serviceFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  category: z.string().trim().min(2, "Danh mục không được để trống."),
  price: priceSchema,
  duration: z.number().int().min(5, "Thời lượng phải ít nhất 5 phút."),
  imageFile: imageFileSchema,
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
