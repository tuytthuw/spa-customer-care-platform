// src/services/treatmentPlanService.ts
import { TreatmentPlan } from "@/features/treatment/types";
import { TreatmentPackage } from "@/features/treatment/types";
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

export const getTreatmentPlanById = async (
  id: string
): Promise<TreatmentPlan | null> => {
  try {
    const response = await fetch(`${PLANS_API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null; // Không tìm thấy
      throw new Error("Failed to fetch treatment plan.");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching treatment plan with id ${id}:`, error);
    return null;
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

export interface PlanData {
  name: string;
  description?: string;
  categories?: string[];
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
  const { imageFile, ...data } = dataToUpdate;
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

export const bookTreatmentSession = async (bookingData: {
  treatmentPackageId: string;
  sessionId: string;
  date: string; // ISO String
  technicianId?: string;
}): Promise<TreatmentPackage> => {
  const { treatmentPackageId, sessionId, date, technicianId } = bookingData;

  // 1. Lấy gói liệu trình hiện tại từ server
  const pkgResponse = await fetch(
    `${CUSTOMER_TREATMENTS_API_URL}/${treatmentPackageId}`
  );
  if (!pkgResponse.ok) {
    throw new Error("Không tìm thấy gói liệu trình của khách hàng.");
  }
  const treatmentPackage: TreatmentPackage = await pkgResponse.json();

  // 2. Tìm và cập nhật buổi hẹn trong gói
  const sessionIndex = treatmentPackage.sessions.findIndex(
    (s) => s.id === sessionId
  );
  if (sessionIndex === -1) {
    throw new Error("Không tìm thấy buổi hẹn trong liệu trình.");
  }

  // Cập nhật thông tin cho buổi hẹn
  treatmentPackage.sessions[sessionIndex] = {
    ...treatmentPackage.sessions[sessionIndex],
    date: date,
    technicianId: technicianId || "", // Gán kỹ thuật viên nếu có
  };

  // 3. Gửi lại toàn bộ đối tượng gói liệu trình đã được cập nhật lên server
  const response = await fetch(
    `${CUSTOMER_TREATMENTS_API_URL}/${treatmentPackageId}`,
    {
      method: "PUT", // Dùng PUT để thay thế toàn bộ
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(treatmentPackage),
    }
  );

  if (!response.ok) {
    throw new Error("Đặt lịch cho buổi trị liệu thất bại.");
  }

  return response.json();
};
