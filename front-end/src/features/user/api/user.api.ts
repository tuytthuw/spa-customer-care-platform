// src/services/userService.ts
import { User } from "@/features/user/types";

const USERS_API_URL = "http://localhost:3001/users";

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
