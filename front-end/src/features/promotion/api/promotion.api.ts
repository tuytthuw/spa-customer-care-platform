import { Promotion } from "@/features/promotion/types";
import { PromotionFormValues } from "@/features/promotion/schemas";
import { uuidv4 } from "zod";

const PROMOTIONS_API_URL = "http://localhost:3001/promotions";

export const getPromotions = async (): Promise<Promotion[]> => {
  const response = await fetch(PROMOTIONS_API_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch promotions");
  }
  return response.json();
};

// MỚI: Thêm khuyến mãi
export const addPromotion = async (
  data: PromotionFormValues
): Promise<Promotion> => {
  const { imageFile, ...promotionData } = data;
  const newPromotion = {
    ...promotionData,
    id: `promo-${uuidv4()}`,
    // Giả lập URL ảnh
    imageUrl: `/images/service-${Math.floor(Math.random() * 3) + 1}.jpg`,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
  };
  const response = await fetch(PROMOTIONS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPromotion),
  });
  if (!response.ok) throw new Error("Failed to add promotion.");
  return response.json();
};

// MỚI: Cập nhật khuyến mãi
export const updatePromotion = async (
  id: string,
  data: PromotionFormValues
): Promise<Promotion> => {
  const { imageFile, ...promotionData } = data;
  const updatedPromotion = {
    ...promotionData,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
  };
  const response = await fetch(`${PROMOTIONS_API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPromotion),
  });
  if (!response.ok) throw new Error("Failed to update promotion.");
  return response.json();
};

// MỚI: Xóa khuyến mãi
export const deletePromotion = async (id: string): Promise<void> => {
  const response = await fetch(`${PROMOTIONS_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete promotion.");
};

// Cập nhật trạng thái
export const updatePromotionStatus = async (
  id: string,
  status: "active" | "inactive"
): Promise<Promotion> => {
  const response = await fetch(`${PROMOTIONS_API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update promotion status.");
  return response.json();
};
