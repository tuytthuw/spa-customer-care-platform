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
  categories: z.array(z.string()).optional(),
  price: priceSchema,
  duration: z.number().int().min(5, "Thời lượng phải ít nhất 5 phút."),
  imageFile: imageFileSchema,
  imageFiles: z.array(z.any()).optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
