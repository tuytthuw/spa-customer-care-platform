// src/features/product/schemas.ts
import { z } from "zod";
import {
  nameSchema,
  priceSchema,
  descriptionSchema,
  imageFileSchema,
} from "@/lib/schemas";

export const productFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  categories: z.array(z.string()).optional(),
  price: priceSchema,
  stock: z.number().int().min(0, "Số lượng tồn kho không được âm."),
  imageFile: imageFileSchema,
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
