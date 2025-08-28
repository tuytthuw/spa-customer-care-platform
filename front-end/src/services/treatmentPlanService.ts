// src/services/treatmentPlanService.ts
import { TreatmentPlan } from "@/types/treatmentPlan";
import { v4 as uuidv4 } from "uuid";

const PLANS_API_URL = "http://localhost:3001/treatmentPlans";

// Lấy danh sách liệu trình
export const getTreatmentPlans = async (): Promise<TreatmentPlan[]> => {
  try {
    const response = await fetch(PLANS_API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch treatment plans.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching treatment plans:", error);
    return [];
  }
};

interface PlanData {
  name: string;
  description?: string;
  price: number;
  totalSessions: number;
  imageFile?: any;
}

// Thêm liệu trình mới
export const addTreatmentPlan = async (
  newPlanData: PlanData
): Promise<TreatmentPlan> => {
  const { imageFile, ...dataToSave } = newPlanData;
  const response = await fetch(PLANS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: uuidv4(),
      ...dataToSave,
      status: "active", // Thêm trạng thái mặc định
      serviceIds: [],
      imageUrl: `/images/service-${Math.floor(Math.random() * 3) + 1}.jpg`,
    }),
  });
  if (!response.ok) throw new Error("Failed to add treatment plan");
  return response.json();
};

// Cập nhật liệu trình
export const updateTreatmentPlan = async (
  planId: string,
  dataToUpdate: PlanData
): Promise<TreatmentPlan> => {
  const { imageFile, ...data } = dataToUpdate;
  const response = await fetch(`${PLANS_API_URL}/${planId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update treatment plan");
  return response.json();
};

// Cập nhật trạng thái liệu trình
export const updateTreatmentPlanStatus = async (
  planId: string,
  newStatus: "active" | "inactive"
): Promise<TreatmentPlan> => {
  const response = await fetch(`${PLANS_API_URL}/${planId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!response.ok) throw new Error("Failed to update treatment plan status");
  return response.json();
};
