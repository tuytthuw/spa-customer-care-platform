// src/features/treatment/schemas.ts
import { z } from "zod";

// Di chuyển từ: src/features/treatment/components/AddTreatmentPlanForm.tsx
export const treatmentPlanFormSchema = z.object({
  name: z.string().trim().min(3, "Tên liệu trình phải có ít nhất 3 ký tự."),
  description: z
    .string()
    .trim()
    .min(10, "Mô tả phải có ít nhất 10 ký tự.")
    .optional(),
  price: z.number().min(0, "Giá phải là một số dương."),
  totalSessions: z.number().int().min(1, "Số buổi phải ít nhất là 1."),
  imageFile: z.any().optional(),
});

export type TreatmentPlanFormValues = z.infer<typeof treatmentPlanFormSchema>;
