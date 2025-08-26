// src/services/customerService.ts
import { Customer } from "@/types/customer";
import { v4 as uuidv4 } from "uuid";
const CUSTOMERS_API_URL = "http://localhost:3001/customers";

// --- Hàm lấy danh sách khách hàng đã được cập nhật ---
export const getCustomers = async (): Promise<Customer[]> => {
  console.log("Fetching customers from API...");
  try {
    const response = await fetch(CUSTOMERS_API_URL, {
      // Bỏ qua cache để luôn lấy dữ liệu mới nhất từ mockAPI
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch customers from the API.");
    }

    const customers: Customer[] = await response.json();
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
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
  email: string;
  phone: string;
  notes?: string;
}

export const updateCustomer = async (
  customerId: string,
  dataToUpdate: UpdateCustomerData
): Promise<Customer> => {
  console.log(`Updating customer ${customerId} with data:`, dataToUpdate);

  const response = await fetch(`${CUSTOMERS_API_URL}/${customerId}`, {
    method: "PATCH", // Dùng PATCH để chỉ cập nhật các trường được gửi lên
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToUpdate),
  });

  if (!response.ok) {
    throw new Error("Failed to update customer");
  }

  return response.json();
};
