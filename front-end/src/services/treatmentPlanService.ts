// src/services/treatmentPlanService.ts
import { TreatmentPlan } from "@/types/treatmentPlan";
import { TreatmentPackage } from "@/types/treatment";
import { v4 as uuidv4 } from "uuid";

const PLANS_API_URL = "http://localhost:3001/treatmentPlans";
const CUSTOMER_TREATMENTS_API_URL = "http://localhost:3001/customerTreatments";

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

export const getCustomerTreatments = async (): Promise<TreatmentPackage[]> => {
  try {
    const response = await fetch(CUSTOMER_TREATMENTS_API_URL, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch customer treatments.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching customer treatments:", error);
    return [];
  }
};

interface PlanData {
  name: string;
  description?: string;
  price: number;
  totalSessions: number;
  imageFile?: File;
}

export const addTreatmentPlan = async (
  newPlanData: PlanData
): Promise<TreatmentPlan> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageFile, ...dataToSave } = newPlanData; // Báo ESLint bỏ qua cảnh báo
  const response = await fetch(PLANS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: uuidv4(),
      ...dataToSave,
      status: "active",
      serviceIds: [],
      imageUrl: `/images/service-${Math.floor(Math.random() * 3) + 1}.jpg`,
    }),
  });
  if (!response.ok) throw new Error("Failed to add treatment plan");
  return response.json();
};

export const updateTreatmentPlan = async (
  planId: string,
  dataToUpdate: PlanData
): Promise<TreatmentPlan> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageFile, ...data } = dataToUpdate; // Báo ESLint bỏ qua cảnh báo
  const response = await fetch(`${PLANS_API_URL}/${planId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update treatment plan");
  return response.json();
};

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
