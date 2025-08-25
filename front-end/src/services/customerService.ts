// src/services/customerService.ts
import { Customer } from "@/types/customer";

// URL API bạn đã copy ở bước 3
const CUSTOMERS_API_URL =
  "https://68ab3267909a5835049dfccd.mockapi.io/customers";

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
    // Trả về mảng rỗng nếu có lỗi để ứng dụng không bị crash
    return [];
  }
};

// --- Bạn có thể giữ lại hoặc cập nhật hàm addCustomer tương tự ---
interface AddCustomerData {
  name: string;
  email: string;
  phone: string;
}

export const addCustomer = async (
  newCustomerData: AddCustomerData
): Promise<Customer> => {
  console.log("Adding new customer via API...", newCustomerData);

  const response = await fetch(CUSTOMERS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newCustomerData,
      // mockAPI thường tự tạo các trường còn lại,
      // nhưng bạn có thể thêm giá trị mặc định nếu cần
      totalAppointments: 0,
      lastVisit: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add customer");
  }

  return response.json();
};
