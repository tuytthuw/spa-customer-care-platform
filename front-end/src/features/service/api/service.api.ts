// src/services/serviceService.ts
import { Service } from "@/types/service";
import { v4 as uuidv4 } from "uuid";

const SERVICES_API_URL = "http://localhost:3001/services";

// Lấy danh sách dịch vụ
export const getServices = async (): Promise<Service[]> => {
  console.log("Fetching services from API...");
  try {
    const response = await fetch(SERVICES_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch services.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

// Kiểu dữ liệu cho form
interface AddServiceData {
  name: string;
  description?: string;
  category: string;
  price: number;
  duration: number;
  imageFile?: any; // Đây là đối tượng File, sẽ không được lưu
}

// Thêm dịch vụ mới
export const addService = async (
  newServiceData: AddServiceData
): Promise<Service> => {
  console.log("Sending new service to API...", newServiceData);

  // Vì json-server không thể lưu file, chúng ta sẽ bỏ qua file ảnh
  // và chỉ lưu các dữ liệu khác.
  const { imageFile, ...dataToSave } = newServiceData;

  const response = await fetch(SERVICES_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: uuidv4(),
      ...dataToSave,
      status: "active",
      // Tạo một ảnh placeholder ngẫu nhiên từ các ảnh có sẵn
      imageUrl: `/images/service-${Math.floor(Math.random() * 3) + 1}.jpg`,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add service");
  }

  return response.json();
};

export const updateServiceStatus = async (
  serviceId: string,
  newStatus: "active" | "inactive"
): Promise<Service> => {
  console.log(`Updating service ${serviceId} to status: ${newStatus}`);

  const response = await fetch(`${SERVICES_API_URL}/${serviceId}`, {
    method: "PATCH", // Dùng PATCH để cập nhật một phần
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update service status");
  }

  return response.json();
};

// Kiểu dữ liệu cho form chỉnh sửa (không bao gồm các trường không thể sửa)
interface UpdateServiceData {
  name: string;
  description?: string;
  category: string;
  price: number;
  duration: number;
  imageFile?: any;
}

export const updateService = async (
  serviceId: string,
  dataToUpdate: UpdateServiceData
): Promise<Service> => {
  console.log(`Updating service ${serviceId} with data:`, dataToUpdate);

  const response = await fetch(`${SERVICES_API_URL}/${serviceId}`, {
    method: "PATCH", // Dùng PATCH để chỉ cập nhật các trường được gửi lên
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToUpdate),
  });

  if (!response.ok) {
    throw new Error("Failed to update service");
  }

  return response.json();
};
