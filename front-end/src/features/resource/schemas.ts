import { z } from "zod";
import { nameSchema } from "@/lib/schemas";

export const resourceFormSchema = z.object({
  name: nameSchema,
  // z.enum mặc định là một trường bắt buộc.
  // Chúng ta không cần thêm bất kỳ tham số nào ở đây.
  type: z.enum(["room", "equipment"]),
  notes: z.string().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
