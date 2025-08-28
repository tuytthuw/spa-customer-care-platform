// src/services/customerService.ts
import { Customer } from "@/types/customer";
import { User } from "@/types/user";
import { v4 as uuidv4 } from "uuid";

const CUSTOMERS_API_URL = "http://localhost:3001/customers";
const USERS_API_URL = "http://localhost:3001/users";

export type FullCustomerProfile = Customer & {
  email: string;
  role: string;
  status: "active" | "inactive";
};

// --- Hàm lấy danh sách khách hàng đã được cập nhật ---
export const getFullCustomerProfiles = async (): Promise<
  FullCustomerProfile[]
> => {
  try {
    const [customersRes, usersRes] = await Promise.all([
      fetch(CUSTOMERS_API_URL, { cache: "no-store" }),
      fetch(USERS_API_URL, { cache: "no-store" }),
    ]);

    if (!customersRes.ok || !usersRes.ok) {
      throw new Error("Failed to fetch data.");
    }

    const customers: Customer[] = await customersRes.json();
    const users: User[] = await usersRes.json();

    // 1. Lọc ra những user đang hoạt động và là khách hàng
    const activeCustomerUsers = users.filter(
      (user) => user.role === "customer" && user.status === "active"
    );
    const activeUserIds = new Set(activeCustomerUsers.map((user) => user.id));
    const usersMap = new Map(
      activeCustomerUsers.map((user) => [user.id, user])
    );

    // 2. Lọc danh sách hồ sơ khách hàng dựa trên user đang hoạt động
    const activeCustomers = customers.filter((customer) =>
      activeUserIds.has(customer.userId)
    );

    // 3. Gộp dữ liệu
    const fullProfiles = activeCustomers.map((customer) => {
      const user = usersMap.get(customer.userId);
      return {
        ...customer,
        email: user?.email || "N/A",
        role: user?.role || "customer",
        status: user?.status || "active", // Luôn là active
      };
    });

    return fullProfiles;
  } catch (error) {
    console.error("Error fetching full customer profiles:", error);
    return [];
  }
};

// --- Bạn có thể giữ lại hoặc cập nhật hàm addCustomer tương tự ---
interface AddCustomerData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}
export const addCustomer = async (
  newCustomerData: AddCustomerData
): Promise<Customer> => {
  console.log("Sending new customer to API...", newCustomerData);

  const response = await fetch(CUSTOMERS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: uuidv4(), // Tạo ID duy nhất ở phía client
      ...newCustomerData,
      totalAppointments: 0,
      lastVisit: new Date().toISOString(),
      status: "active",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add customer");
  }

  return response.json();
};
export const updateCustomerStatus = async (
  customerId: string,
  newStatus: "active" | "inactive"
): Promise<Customer> => {
  console.log(`Updating customer ${customerId} to status: ${newStatus}`);

  const response = await fetch(`${CUSTOMERS_API_URL}/${customerId}`, {
    method: "PATCH", // Dùng PATCH để cập nhật một phần
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update customer status");
  }

  return response.json();
};

// Kiểu dữ liệu cho form chỉnh sửa (không bao gồm các trường không thể sửa)
interface UpdateCustomerData {
  name: string;
  phone: string;
  notes?: string;
}
export const updateCustomer = async (
  customerId: string,
  dataToUpdate: UpdateCustomerData
): Promise<Customer> => {
  // ... (logic không đổi)
  const response = await fetch(`${CUSTOMERS_API_URL}/${customerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToUpdate),
  });
  if (!response.ok) throw new Error("Failed to update customer profile");
  return response.json();
};
