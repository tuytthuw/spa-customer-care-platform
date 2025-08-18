// src/actions/auth.ts
"use server";

import * as z from "zod";

// 1. Định nghĩa kiểu User
interface User {
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
}

// 2. Định nghĩa kiểu trả về thống nhất
type ActionResult =
  | { success: true; user: User }
  | { success: false; error: string };

// Schema cho form đăng nhập
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Schema cho form đăng ký
const registerFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

// Giả lập cơ sở dữ liệu người dùng
const mockUsers: User[] = [
  { name: "Admin", email: "admin@gmail.com", role: "ADMIN" },
  { name: "Tuyet Thu", email: "client@gmail.com", role: "CLIENT" },
];

// Action Đăng nhập
export async function login(
  values: z.infer<typeof formSchema>
): Promise<ActionResult> {
  console.log("DỮ LIỆU NHẬN ĐƯỢC:", values);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (values.email === "admin@gmail.com" && values.password === "123456") {
    return { success: true, user: mockUsers[0] };
  }
  if (values.email === "client@gmail.com" && values.password === "123456") {
    return { success: true, user: mockUsers[1] };
  }
  return { success: false, error: "Email hoặc mật khẩu không chính xác." };
}

// Action Đăng ký
export async function register(
  values: z.infer<typeof registerFormSchema>
): Promise<ActionResult> {
  console.log("Đang gọi API đăng ký với dữ liệu:", values);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const existingUser = mockUsers.find((user) => user.email === values.email);
  if (existingUser) {
    return { success: false, error: "Email này đã được sử dụng." };
  }

  const newUser: User = { ...values, role: "CLIENT" };
  mockUsers.push(newUser);

  // SỬA LỖI: Trả về đối tượng user mới tạo
  return { success: true, user: newUser };
}

// Action Đăng nhập bằng Google
export async function loginWithGoogle(code: string): Promise<ActionResult> {
  console.log("Gửi authorization code cho back-end:", code);
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (code) {
    // SỬA LỖI: Giả lập trả về một người dùng sau khi đăng nhập Google thành công
    return {
      success: true,
      user: {
        name: "Google User",
        email: "google.user@example.com",
        role: "CLIENT",
      },
    };
  }

  return { success: false, error: "Authorization code không hợp lệ." };
}
