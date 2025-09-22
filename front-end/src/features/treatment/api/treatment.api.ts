// src/services/treatmentPlanService.ts
import { TreatmentPlan, TreatmentPackage } from "@/features/treatment/types";
import { v4 as uuidv4 } from "uuid";
import { TreatmentPlanFormValues } from "@/features/treatment/schemas";
import { createAppointment } from "@/features/appointment/api/appointment.api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PLANS_API_URL = `${API_URL}/treatmentPlans`;
const CUSTOMER_TREATMENTS_API_URL = `${API_URL}/customerTreatments`;

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

export const getCustomerTreatments = async (
  customerId: string
): Promise<TreatmentPackage[]> => {
  if (!customerId) return []; // Trả về mảng rỗng nếu không có customerId
  try {
    // Thêm "?customerId=" vào URL để lọc dữ liệu trên json-server
    const response = await fetch(
      `${CUSTOMER_TREATMENTS_API_URL}?customerId=${customerId}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch customer treatments.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching customer treatments:", error);
    return [];
  }
};

export const addTreatmentPlan = async (
  newPlanData: TreatmentPlanFormValues
): Promise<TreatmentPlan> => {
  const { imageFile, ...dataToSave } = newPlanData;

  const stepsWithNumbers = dataToSave.steps.map((step, index) => ({
    ...step,
    step: index + 1,
  }));

  const response = await fetch(PLANS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: uuidv4(),
      ...dataToSave,
      steps: stepsWithNumbers,
      totalSessions: stepsWithNumbers.length,
      status: "active",
      imageUrl: `/images/service-${Math.floor(Math.random() * 3) + 1}.jpg`,
    }),
  });
  if (!response.ok) throw new Error("Failed to add treatment plan");
  return response.json();
};

export const updateTreatmentPlan = async (
  planId: string,
  dataToUpdate: TreatmentPlanFormValues
): Promise<TreatmentPlan> => {
  const { imageFile, ...data } = dataToUpdate;

  const stepsWithNumbers = data.steps.map((step, index) => ({
    ...step,
    step: index + 1,
  }));

  const finalData = {
    ...data,
    steps: stepsWithNumbers,
    totalSessions: stepsWithNumbers.length,
  };

  const response = await fetch(`${PLANS_API_URL}/${planId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalData),
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
  customerId: string; // <-- Thêm customerId
  serviceId: string; // <-- Thêm serviceId (của dịch vụ trong buổi đó)
}): Promise<TreatmentPackage> => {
  const {
    treatmentPackageId,
    sessionId,
    date,
    technicianId,
    customerId,
    serviceId,
  } = bookingData;

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
    technicianId: technicianId || "",
    status: "completed", // <-- Giả định khi đặt lịch là hoàn thành buổi đó (có thể điều chỉnh logic này)
  };
  treatmentPackage.completedSessions += 1;

  // --- LOGIC MỚI: TẠO MỘT APPOINTMENT TƯƠNG ỨNG ---
  await createAppointment({
    customerId,
    serviceId,
    date,
    technicianId,
    paymentStatus: "paid", // Luôn là "paid" vì thuộc liệu trình đã mua
    treatmentPackageId: treatmentPackageId, // <--- Dấu vết 1
    treatmentSessionId: sessionId, // <--- Dấu vết 2
  });
  // --- KẾT THÚC LOGIC MỚI ---

  // 3. Gửi lại toàn bộ đối tượng gói liệu trình đã được cập nhật lên server
  const response = await fetch(
    `${CUSTOMER_TREATMENTS_API_URL}/${treatmentPackageId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(treatmentPackage),
    }
  );

  if (!response.ok) {
    throw new Error("Đặt lịch cho buổi trị liệu thất bại.");
  }

  return response.json();
};
