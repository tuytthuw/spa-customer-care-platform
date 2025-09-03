// src/features/treatment/schemas.ts
import { descriptionSchema, nameSchema, priceSchema } from "@/lib/schemas";
import { z } from "zod";

// Di chuyển từ: src/features/treatment/components/AddTreatmentPlanForm.tsx
export const treatmentPlanFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  categories: z.array(z.string()).optional(),
  price: priceSchema,
  totalSessions: z.number().int().min(1, "Số buổi phải ít nhất là 1."),
  imageFile: z.any().optional(),
});

export type TreatmentPlanFormValues = z.infer<typeof treatmentPlanFormSchema>;
