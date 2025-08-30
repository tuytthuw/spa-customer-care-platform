"use server";

import { z } from "zod";
import { User } from "@/features/user/types";
import { Customer } from "@/features/customer/types";
import crypto from "crypto";

const USERS_API_URL = "http://localhost:3001/users";
const CUSTOMERS_API_URL = "http://localhost:3001/customers";

type ActionResult = {
  success?: string;
  error?: string;
  user?: Omit<User, "password"> & { role: string };
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  token: z.string().min(1), // Giả lập token OTP
});

export const login = async (
  values: z.infer<typeof loginSchema>
): Promise<ActionResult> => {
  const { email, password } = values;
  // 4. Chỉ cần tìm trong /users
  const response = await fetch(
    `${USERS_API_URL}?email=${email}&password=${password}`
  );
  const matchingUsers: User[] = await response.json();

  if (matchingUsers.length === 0) {
    return { error: "Email hoặc mật khẩu không chính xác!" };
  }
  if (matchingUsers[0].status === "inactive") {
    return { error: "Tài khoản này đã bị vô hiệu hóa." };
  }

  const { password: _, ...userWithoutPassword } = matchingUsers[0];
  return { success: "Đăng nhập thành công!", user: userWithoutPassword };
};

export async function register(
  values: z.infer<typeof registerSchema>
): Promise<ActionResult> {
  const { name, email, password } = values;

  const userRes = await fetch(`${USERS_API_URL}?email=${email}`);
  const existingUser = await userRes.json();
  if (existingUser.length > 0) {
    return { error: "Email này đã được sử dụng." };
  }

  // 1. Tạo bản ghi trong "users"
  const newUserData: User = {
    id: `user-${crypto.randomUUID()}`,
    email,
    password,
    role: "customer",
    status: "active",
  };
  const newUserResponse = await fetch(USERS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUserData),
  });
  if (!newUserResponse.ok) {
    return { error: "Không thể tạo tài khoản người dùng." };
  }

  // 2. Tạo bản ghi hồ sơ trong "customers"
  const newCustomerProfile: Omit<Customer, "id"> = {
    userId: newUserData.id,
    name,
    phone: "",
    totalAppointments: 0,
    lastVisit: new Date().toISOString(),
  };
  const newCustomerResponse = await fetch(CUSTOMERS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCustomerProfile),
  });

  if (!newCustomerResponse.ok) {
    // Lý tưởng nhất là có một transaction để rollback việc tạo user
    return { error: "Không thể tạo hồ sơ khách hàng." };
  }

  const { password: _, ...userWithoutPassword } = newUserData;
  return { success: "Đăng ký thành công!", user: userWithoutPassword };
}

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>
): Promise<ActionResult> => {
  const validatedFields = resetPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }
  const { email, password, token } = validatedFields.data;

  if (token !== "123456") {
    return { error: "Mã OTP không hợp lệ hoặc đã hết hạn." };
  }

  // Chỉ cần tìm người dùng trong /users
  const response = await fetch(`${USERS_API_URL}?email=${email}`);
  const matchingUsers: User[] = await response.json();

  if (matchingUsers.length === 0) {
    return { error: "Không tìm thấy tài khoản với email này." };
  }

  const userToUpdate = matchingUsers[0];
  const updateResponse = await fetch(`${USERS_API_URL}/${userToUpdate.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: password }),
  });

  if (!updateResponse.ok) {
    return { error: "Không thể cập nhật mật khẩu." };
  }

  return { success: "Mật khẩu của bạn đã được cập nhật thành công!" };
};

export const sendPasswordResetOtp = async (
  email: string
): Promise<{ success?: string; error?: string }> => {
  if (!email) {
    return { error: "Email không được để trống." };
  }

  // Chỉ cần kiểm tra email trong /users
  const response = await fetch(`${USERS_API_URL}?email=${email}`);
  const matchingUsers = await response.json();

  if (matchingUsers.length > 0) {
    console.log(`Giả lập gửi OTP đến email: ${email}`);
  }

  return {
    success:
      "Nếu email của bạn tồn tại trong hệ thống, một mã OTP đã được gửi.",
  };
};
