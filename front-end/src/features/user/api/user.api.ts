// src/services/userService.ts
import { User } from "@/features/user/types";
import { ChangePasswordFormValues } from "@/features/auth/schemas";

const USERS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

// Lấy danh sách tất cả người dùng
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(USERS_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch users.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Cập nhật trạng thái của một người dùng (active/inactive)
export const updateUserStatus = async (
  userId: string,
  newStatus: "active" | "inactive"
): Promise<User> => {
  const response = await fetch(`${USERS_API_URL}/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user status");
  }

  return response.json();
};

export const changePassword = async ({
  userId,
  oldPassword,
  newPassword,
}: ChangePasswordFormValues & { userId: string }): Promise<User> => {
  const USERS_API_URL = "http://localhost:3001/users";

  // Bước 1: Lấy thông tin người dùng hiện tại để kiểm tra mật khẩu cũ
  const userRes = await fetch(`${USERS_API_URL}/${userId}`);
  if (!userRes.ok) {
    throw new Error("Không tìm thấy người dùng.");
  }
  const currentUser: User = await userRes.json();

  // Bước 2: So sánh mật khẩu cũ (trong thực tế sẽ so sánh hash)
  if (currentUser.password !== oldPassword) {
    throw new Error("Mật khẩu cũ không chính xác.");
  }

  // Bước 3: Cập nhật mật khẩu mới
  const response = await fetch(`${USERS_API_URL}/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!response.ok) {
    throw new Error("Cập nhật mật khẩu thất bại.");
  }

  return response.json();
};
