// src/lib/schemas.ts
import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(3, { message: "Tên phải có ít nhất 3 ký tự." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  phone: z
    .string()
    .regex(/(0[3|5|7|8|9])+([0-9]{8})\b/, {
      message: "Số điện thoại không hợp lệ.",
    })
    .or(z.literal(""))
    .optional(), // Cho phép để trống hoặc phải đúng định dạng
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
