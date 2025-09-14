// src/services/resourceService.ts
import { Resource } from "@/features/resource/types";
import { v4 as uuidv4 } from "uuid";

const RESOURCES_API_URL = "http://localhost:3001/resources";

export const getResources = async (): Promise<Resource[]> => {
  try {
    const response = await fetch(RESOURCES_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch resources.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
};

// Kiểu dữ liệu cho Form
export type ResourceFormData = Omit<Resource, "id" | "status">;

// ✅ MỚI: Thêm tài nguyên
export const addResource = async (
  data: ResourceFormData
): Promise<Resource> => {
  const newResource = {
    ...data,
    id: `${data.type}-${uuidv4()}`,
    status: "available", // Mặc định là "Sẵn sàng"
  };
  const response = await fetch(RESOURCES_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newResource),
  });
  if (!response.ok) throw new Error("Failed to add resource.");
  return response.json();
};

// ✅ MỚI: Cập nhật tài nguyên
export const updateResource = async (
  id: string,
  data: ResourceFormData
): Promise<Resource> => {
  const response = await fetch(`${RESOURCES_API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update resource.");
  return response.json();
};

// ✅ MỚI: Cập nhật trạng thái
export const updateResourceStatus = async (
  id: string,
  newStatus: Resource["status"]
): Promise<Resource> => {
  const response = await fetch(`${RESOURCES_API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!response.ok) throw new Error("Failed to update resource status.");
  return response.json();
};
