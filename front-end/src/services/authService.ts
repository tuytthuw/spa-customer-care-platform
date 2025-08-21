// src/actions/auth.ts
"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import crypto from "crypto"; // Dùng để tạo ID ngẫu nhiên

// 1. Định nghĩa kiểu User, đảm bảo mọi User đều có id
interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
}

// 2. Định nghĩa kiểu trả về thống nhất cho các action
type ActionResult = {
  success?: string;
  error?: string;
  user?: User;
};

// 3. Định nghĩa Zod schema cho các form
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

// Giả lập cơ sở dữ liệu người dùng (đã thêm id)
const mockUsers: User[] = [
  { id: "1", name: "Admin", email: "admin@gmail.com", role: "ADMIN" },
  { id: "2", name: "Tuyet Thu", email: "client@gmail.com", role: "CLIENT" },
];

// --- Server Actions ---

// Action Đăng nhập
export const login = async (
  values: z.infer<typeof loginSchema>
): Promise<ActionResult> => {
  try {
    const validatedFields = loginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Dữ liệu không hợp lệ!" };
    }
    const { email, password } = validatedFields.data;

    // Giả lập gọi API (bạn có thể thay thế bằng logic gọi API thật)
    const user = mockUsers.find(
      (u) => u.email === email /* && u.password === password */
    );

    if (!user) {
      return { error: "Email hoặc mật khẩu không chính xác!" };
    }

    // Lưu token vào cookies
    (cookies() as any).set("accessToken", "mock-access-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return {
      success: "Đăng nhập thành công!",
      user: user,
    };
  } catch (error) {
    return { error: "Đã có lỗi xảy ra. Vui lòng thử lại." };
  }
};

// Action Đăng ký
export async function register(
  values: z.infer<typeof registerSchema>
): Promise<ActionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const existingUser = mockUsers.find((user) => user.email === values.email);
  if (existingUser) {
    return { error: "Email này đã được sử dụng." };
  }

  const newUser: User = {
    id: crypto.randomUUID(), // Tạo ID ngẫu nhiên
    ...values,
    role: "CLIENT",
  };
  mockUsers.push(newUser);

  return { success: "Đăng ký thành công!", user: newUser };
}

// Action Đăng nhập bằng Google
export async function loginWithGoogle(code: string): Promise<ActionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (code) {
    // Giả lập trả về một người dùng sau khi đăng nhập Google thành công
    const googleUser: User = {
      id: crypto.randomUUID(),
      name: "Google User",
      email: "google.user@example.com",
      role: "CLIENT",
    };
    return {
      success: "Đăng nhập bằng Google thành công!",
      user: googleUser,
    };
  }

  return { error: "Authorization code không hợp lệ." };
}
