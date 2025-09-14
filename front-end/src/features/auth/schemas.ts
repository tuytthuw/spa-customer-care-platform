import { z } from "zod";
import { emailSchema, passwordSchema, nameSchema } from "@/lib/schemas"; // <-- Import schema chung

// Sử dụng trực tiếp schema chung
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Mật khẩu không được để trống." }), // Giữ lại vì password ở đây khác
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordApiSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  token: z.string().min(1, "Token không được để trống."),
});

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
  });

// Di chuyển từ: src/features/auth/components/otp-form.tsx
export const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "Mã OTP phải có 6 chữ số.",
  }),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, { message: "Mật khẩu không được để trống." }),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
