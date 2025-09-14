// src/services/customerService.ts
import { Customer, FullCustomerProfile } from "@/features/customer/types";
import { User } from "@/features/user/types";
import { v4 as uuidv4 } from "uuid";

const CUSTOMERS_API_URL = "http://localhost:3001/customers";
const USERS_API_URL = "http://localhost:3001/users";

export const getCustomers = async (): Promise<FullCustomerProfile[]> => {
  try {
    const [customersRes, usersRes] = await Promise.all([
      fetch(CUSTOMERS_API_URL, { cache: "no-store" }),
      fetch(USERS_API_URL, { cache: "no-store" }),
    ]);

    if (!customersRes.ok || !usersRes.ok) {
      throw new Error("Failed to fetch customer or user data.");
    }

    const customers: Customer[] = await customersRes.json();
    const users: User[] = await usersRes.json();

    // Tạo một Map để tra cứu thông tin user hiệu quả bằng userId
    const usersMap = new Map<string, User>(
      users.map((user) => [user.id, user])
    );

    // Kết hợp và lọc dữ liệu
    const fullProfiles = customers
      .map((customer) => {
        const user = usersMap.get(customer.userId);
        if (user) {
          return {
            ...customer,
            email: user.email,
            status: user.status,
          };
        }
        return null; // Bỏ qua customer không có user tương ứng
      })
      .filter((profile): profile is FullCustomerProfile => profile !== null); // Lọc bỏ các giá trị null

    return fullProfiles;
  } catch (error) {
    console.error("Error fetching full customer profiles:", error);
    return [];
  }
};

export const getCustomerById = async (
  customerId: string
): Promise<FullCustomerProfile | null> => {
  try {
    const [customerRes, usersRes] = await Promise.all([
      fetch(`${CUSTOMERS_API_URL}/${customerId}`),
      fetch(USERS_API_URL), // Vẫn cần fetch hết user để tìm email
    ]);

    if (!customerRes.ok) {
      return null;
    }

    const customer: Customer = await customerRes.json();
    const users: User[] = await usersRes.json();
    const user = users.find((u) => u.id === customer.userId);

    if (!user) {
      // Hoặc trả về customer không có email/status
      return null;
    }

    return {
      ...customer,
      email: user.email,
      status: user.status,
    };
  } catch (error) {
    console.error(
      `Error fetching customer profile for id: ${customerId}`,
      error
    );
    return null;
  }
};

// --- CÁC HÀM TIỆN ÍCH KHÁC ---

// Kiểu dữ liệu cho form thêm khách hàng
interface AddCustomerData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  avatar?: File;
}

// Thêm khách hàng mới (bao gồm cả việc tạo user tương ứng)
export const addCustomer = async (
  newCustomerData: AddCustomerData
): Promise<Customer> => {
  // Logic này sẽ cần được mở rộng để tạo cả User và Customer Profile
  // Tạm thời giữ nguyên để đơn giản

  console.log("Sending new customer to API...", newCustomerData);
  const newId = uuidv4();
  const response = await fetch(CUSTOMERS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: uuidv4(),
      userId: `user-${uuidv4()}`, // Cần một userId thật
      ...newCustomerData,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${newId}`,
      totalAppointments: 0,
      lastVisit: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add customer");
  }

  return response.json();
};

// Cập nhật trạng thái của USER (vì status nằm ở bảng users)
export const updateCustomerStatus = async (
  userId: string,
  newStatus: "active" | "inactive"
): Promise<User> => {
  console.log(`Updating user ${userId} to status: ${newStatus}`);

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

// Cập nhật thông tin PROFILE của khách hàng
interface UpdateCustomerData {
  name: string;
  phone: string;
  notes?: string;
}

export const updateCustomer = async (
  customerId: string,
  dataToUpdate: UpdateCustomerData
): Promise<Customer> => {
  const response = await fetch(`${CUSTOMERS_API_URL}/${customerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToUpdate),
  });
  if (!response.ok) throw new Error("Failed to update customer profile");
  return response.json();
};

type UpdateCustomerProfileData = Partial<
  Pick<
    FullCustomerProfile,
    "name" | "phone" | "preferences" | "notificationSettings"
  >
> & { avatar?: File | string };

export const updateCustomerProfile = async (
  customerId: string,
  dataToUpdate: UpdateCustomerProfileData
): Promise<Customer> => {
  const updatePayload = { ...dataToUpdate };

  // Xử lý upload avatar (mô phỏng)
  if (dataToUpdate.avatar && dataToUpdate.avatar instanceof File) {
    updatePayload.avatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${new Date().getTime()}`;
  }

  const response = await fetch(`${CUSTOMERS_API_URL}/${customerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatePayload),
  });
  if (!response.ok) throw new Error("Failed to update customer profile");
  return response.json();
};
