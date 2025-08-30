// src/features/customer/schemas.ts
import { z } from "zod";
import { personSchema } from "@/lib/schemas"; // <-- Import schema chung

export const customerFormSchema = personSchema.extend({
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
