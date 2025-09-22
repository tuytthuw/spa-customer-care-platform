// src/features/product/schemas.ts
import { z } from "zod";
import {
  nameSchema,
  priceSchema,
  descriptionSchema,
  imageFileSchema,
} from "@/lib/schemas";

// Schema cho form thêm/sửa sản phẩm
export const productFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  categories: z.array(z.string()).optional(),
  price: priceSchema,
  stock: z.number().int().min(0, "Số lượng tồn kho không được âm."),
  imageFile: imageFileSchema,
  imageFiles: z.array(z.any()).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// Schema cho form nhập kho
export const addStockSchema = z.object({
  productId: z.string().min(1, "Vui lòng chọn một sản phẩm."),
  quantityToAdd: z.number().min(1, "Số lượng nhập phải lớn hơn 0."),
});

export type AddStockFormValues = z.infer<typeof addStockSchema>;
