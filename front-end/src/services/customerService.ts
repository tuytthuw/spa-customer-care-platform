// src/services/customerService.ts
import { mockCustomers } from "@/lib/mock-data";
import { Customer } from "@/types/customer";
import { v4 as uuidv4 } from "uuid"; // Cài đặt uuid để tạo ID giả

// --- Thêm định nghĩa kiểu cho dữ liệu form ---
interface AddCustomerData {
  name: string;
  email: string;
  phone: string;
}

// Mô phỏng việc gọi API để lấy danh sách khách hàng
export const getCustomers = async (): Promise<Customer[]> => {
  console.log("Fetching customers from service..."); // Thêm log để dễ theo dõi

  // Giả lập độ trễ của mạng (giống như đang gọi API thật)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Khi có backend, bạn chỉ cần thay đổi logic ở đây để gọi API thật bằng fetch() hoặc axios
  return Promise.resolve(mockCustomers);
};

// --- Hàm mới để thêm khách hàng ---
export const addCustomer = async (
  newCustomerData: AddCustomerData
): Promise<Customer> => {
  console.log("Adding new customer...", newCustomerData);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập độ trễ mạng

  // Khi có backend, đây sẽ là lệnh fetch POST
  // const response = await fetch('/api/customers', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(newCustomerData),
  // });
  // if (!response.ok) throw new Error("Failed to add customer");
  // return response.json();

  // Logic giả lập: tạo khách hàng mới và thêm vào mảng mock
  const newCustomer: Customer = {
    id: uuidv4(), // Tạo ID ngẫu nhiên
    totalAppointments: 0,
    lastVisit: new Date().toISOString(),
    ...newCustomerData,
  };

  mockCustomers.unshift(newCustomer); // Thêm vào đầu mảng để dễ thấy
  return Promise.resolve(newCustomer);
};
// export const addCustomer = async (newCustomerData: Omit<Customer, 'id'>): Promise<Customer> => { ... };
