import { TreatmentPlan } from "@/types/treatmentPlan";
import { v4 as uuidv4 } from "uuid";

const PLANS_API_URL = "http://localhost:3001/treatmentPlans";

export const getTreatmentPlans = async (): Promise<TreatmentPlan[]> => {
  console.log("Fetching treatment plans from API...");
  try {
    const response = await fetch(PLANS_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch treatment plans.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching treatment plans:", error);
    return [];
  }
};

interface AddPlanData {
  name: string;
  description?: string;
  price: number;
  totalSessions: number;
  imageFile?: any;
}

export const addTreatmentPlan = async (
  newPlanData: AddPlanData
): Promise<TreatmentPlan> => {
  console.log("Sending new treatment plan to API...", newPlanData);

  const { imageFile, ...dataToSave } = newPlanData;

  const response = await fetch(PLANS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: uuidv4(),
      ...dataToSave,
      serviceIds: [], // Tạm thời để trống, có thể nâng cấp sau
      imageUrl: `/images/service-${Math.floor(Math.random() * 3) + 1}.jpg`,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add treatment plan");
  }

  return response.json();
};
