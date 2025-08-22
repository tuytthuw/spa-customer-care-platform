// src/services/authService.ts
"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import crypto from "crypto";
import { mockStaff, mockCustomers } from "@/lib/mock-data";

// Định nghĩa lại User để bao gồm password và tất cả các vai trò
interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT" | "technician" | "receptionist" | "manager";
  password?: string;
}

// Kiểu trả về thống nhất cho các action
type ActionResult = {
  success?: string;
  error?: string;
  user?: Omit<User, "password">; // Trả về user không có mật khẩu
};

// Zod schema cho các form
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

// Giả lập cơ sở dữ liệu người dùng
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@gmail.com",
    role: "ADMIN",
    password: "password",
  },
  {
    id: "2",
    name: "Tuyet Thu",
    email: "client@gmail.com",
    role: "CLIENT",
    password: "password",
  },
];

// Action Đăng nhập (ĐÃ SỬA LỖI)
export const login = async (
  values: z.infer<typeof loginSchema>
): Promise<ActionResult> => {
  try {
    const validatedFields = loginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Dữ liệu không hợp lệ!" };
    }
    const { email, password } = validatedFields.data;

    // Gán vai trò cho khách hàng và gộp tất cả người dùng
    const customersWithRole = mockCustomers.map((c) => ({
      ...c,
      role: "CLIENT" as const,
    }));
    const allUsers: User[] = [...mockUsers, ...mockStaff, ...customersWithRole];

    // Kiểm tra thông tin đăng nhập
    const user = allUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return { error: "Email hoặc mật khẩu không chính xác!" };
    }

    (cookies() as any).set("accessToken", "mock-access-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Loại bỏ mật khẩu trước khi gửi về client
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: "Đăng nhập thành công!",
      user: userWithoutPassword,
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
    id: crypto.randomUUID(),
    ...values,
    role: "CLIENT",
  };
  mockUsers.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return { success: "Đăng ký thành công!", user: userWithoutPassword };
}

// Action Đăng nhập bằng Google
export async function loginWithGoogle(code: string): Promise<ActionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (code) {
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
