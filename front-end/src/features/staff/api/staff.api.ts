// src/services/staffService.ts
import { Staff, FullStaffProfile } from "@/features/staff/types";
import { User } from "@/features/user/types";
import { v4 as uuidv4 } from "uuid";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STAFF_API_URL = `${API_URL}/staff`;
const USERS_API_URL = `${API_URL}/users`;

export const getStaffProfiles = async (): Promise<FullStaffProfile[]> => {
  try {
    const [staffRes, usersRes] = await Promise.all([
      fetch(STAFF_API_URL, { cache: "no-store" }),
      fetch(USERS_API_URL, { cache: "no-store" }),
    ]);

    if (!staffRes.ok || !usersRes.ok) {
      throw new Error("Failed to fetch staff or user data.");
    }

    const staff: Staff[] = await staffRes.json();
    const users: User[] = await usersRes.json();
    const usersMap = new Map<string, User>(
      users.map((user) => [user.id, user])
    );

    const fullProfiles = staff
      .map((staffMember) => {
        const user = usersMap.get(staffMember.userId);
        if (user) {
          return {
            ...staffMember,
            email: user.email,
            status: user.status, // Lấy status từ user object
          };
        }
        return null;
      })
      .filter((profile): profile is FullStaffProfile => profile !== null);

    return fullProfiles;
  } catch (error) {
    console.error("Error fetching full staff profiles:", error);
    return [];
  }
};
// Lấy danh sách nhân viên
export const getStaff = async (): Promise<Staff[]> => {
  console.log("Fetching staff from API...");
  try {
    const response = await fetch(STAFF_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch staff.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
};

// Kiểu dữ liệu cho form thêm nhân viên
interface AddStaffData {
  name: string;
  email: string;
  phone: string;
  role: "technician" | "receptionist" | "manager";
  status: "active" | "inactive";
  serviceIds?: string[];
  avatar?: File; // Đây là đối tượng File, sẽ không được lưu
}

//Thêm nhân viên mới
export const addStaff = async (newStaffData: AddStaffData): Promise<Staff> => {
  console.log("Sending new staff to API...", newStaffData);

  // Trong thực tế, bạn sẽ upload file avatar lên một dịch vụ lưu trữ
  // và chỉ lưu URL vào db.json.
  // Ở đây, chúng ta sẽ bỏ qua file và tạo một avatar giả.
  const { avatar, ...dataToSave } = newStaffData;

  const response = await fetch(STAFF_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: uuidv4(),
      userId: `user-${uuidv4()}`, // Tạo ID ngẫu nhiên
      ...dataToSave,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${dataToSave.name}`, // Tạo avatar ngẫu nhiên
      status: "active",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add staff");
  }

  return response.json();
};

// Kiểu dữ liệu cho form chỉnh sửa
interface UpdateStaffData {
  name: string;
  email: string;
  phone: string;
  role: "technician" | "receptionist" | "manager";
  serviceIds?: string[];
}

// Hàm cập nhật thông tin chi tiết
export const updateStaff = async (
  staffId: string,
  dataToUpdate: UpdateStaffData
): Promise<Staff> => {
  console.log(`Updating staff ${staffId} with data:`, dataToUpdate);

  const response = await fetch(`${STAFF_API_URL}/${staffId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToUpdate),
  });

  if (!response.ok) {
    throw new Error("Failed to update staff");
  }

  return response.json();
};

// Hàm cập nhật trạng thái
export const updateStaffStatus = async (
  staffId: string,
  newStatus: "active" | "inactive"
): Promise<Staff> => {
  console.log(`Updating staff ${staffId} to status: ${newStatus}`);

  const response = await fetch(`${STAFF_API_URL}/${staffId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update staff status");
  }

  return response.json();
};

type UpdateStaffProfileData = Pick<FullStaffProfile, "name" | "phone"> & {
  avatar?: File | string;
};

export const updateStaffProfile = async (
  staffId: string,
  dataToUpdate: UpdateStaffProfileData
): Promise<Staff> => {
  // Nếu avatar là một File, tức là người dùng đã tải ảnh mới
  const newAvatarUrl =
    dataToUpdate.avatar instanceof File
      ? `https://api.dicebear.com/7.x/notionists/svg?seed=${new Date().getTime()}`
      : dataToUpdate.avatar; // Giữ lại url cũ nếu không thay đổi

  const response = await fetch(`${STAFF_API_URL}/${staffId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: dataToUpdate.name,
      phone: dataToUpdate.phone,
      avatar: newAvatarUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update staff profile");
  }

  return response.json();
};
