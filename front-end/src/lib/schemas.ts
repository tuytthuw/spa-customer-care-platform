// src/lib/schemas.ts
import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(3, { message: "Tên phải có ít nhất 3 ký tự." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  phone: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
