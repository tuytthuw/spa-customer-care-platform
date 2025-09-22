"use server";

import { z } from "zod";
import { User } from "@/features/user/types";
import { Customer } from "@/features/customer/types";
import { Staff } from "@/features/staff/types";
import crypto from "crypto";

// Import các schema từ tệp tập trung
import {
  loginSchema,
  registerSchema,
  resetPasswordApiSchema,
  forgotPasswordSchema,
} from "@/features/auth/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USERS_API_URL = `${API_URL}/users`;
const CUSTOMERS_API_URL = `${API_URL}/customers`;
const STAFF_API_URL = `${API_URL}/staff`;

type ActionResult = {
  success?: string;
  error?: string;
  user?: Omit<User, "password"> & {
    role: string;
    name?: string;
    phone?: string;
  };
};

export const login = async (
  values: z.infer<typeof loginSchema>
): Promise<ActionResult> => {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }
  const { email, password } = validatedFields.data;

  const response = await fetch(
    `${USERS_API_URL}?email=${email}&password=${password}`
  );
  const matchingUsers: User[] = await response.json();

  if (matchingUsers.length === 0) {
    return { error: "Email hoặc mật khẩu không chính xác!" };
  }
  const user = matchingUsers[0]; // ✅ Sửa lỗi: Khai báo biến user ở đây
  if (user.status === "inactive") {
    return { error: "Tài khoản này đã bị vô hiệu hóa." };
  }

  const userProfile: { name?: string; phone?: string } = {};

  if (user.role === "customer") {
    const customerRes = await fetch(`${CUSTOMERS_API_URL}?userId=${user.id}`);
    const matchingCustomers: Customer[] = await customerRes.json();
    if (matchingCustomers.length > 0) {
      userProfile.name = matchingCustomers[0].name;
      userProfile.phone = matchingCustomers[0].phone;
    }
  } else {
    // Giả sử các vai trò khác đều là staff
    const staffRes = await fetch(`${STAFF_API_URL}?userId=${user.id}`);
    const matchingStaff: Staff[] = await staffRes.json();
    if (matchingStaff.length > 0) {
      userProfile.name = matchingStaff[0].name;
      userProfile.phone = matchingStaff[0].phone;
    }
  }

  const { password: _, ...userWithoutPassword } = user;

  // ✅ Kết hợp thông tin user và profile trước khi trả về
  const fullUser = {
    ...userWithoutPassword,
    ...userProfile,
  };

  return { success: "Đăng nhập thành công!", user: fullUser };
};

export async function register(
  values: z.infer<typeof registerSchema>
): Promise<ActionResult> {
  const validatedFields = registerSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }
  const { name, email, password } = validatedFields.data;

  const userRes = await fetch(`${USERS_API_URL}?email=${email}`);
  const existingUser = await userRes.json();
  if (existingUser.length > 0) {
    return { error: "Email này đã được sử dụng." };
  }

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
    return { error: "Không thể tạo hồ sơ khách hàng." };
  }

  const { password: _, ...userWithoutPassword } = newUserData;
  return { success: "Đăng ký thành công!", user: userWithoutPassword };
}

export const resetPassword = async (
  values: z.infer<typeof resetPasswordApiSchema>
): Promise<ActionResult> => {
  const validatedFields = resetPasswordApiSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }
  const { email, password, token } = validatedFields.data;

  if (token !== "123456") {
    return { error: "Mã OTP không hợp lệ hoặc đã hết hạn." };
  }

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
  values: z.infer<typeof forgotPasswordSchema>
): Promise<{ success?: string; error?: string }> => {
  const validatedFields = forgotPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Email không hợp lệ." };
  }
  const { email } = validatedFields.data;

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
