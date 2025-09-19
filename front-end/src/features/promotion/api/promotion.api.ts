import { Promotion } from "@/features/promotion/types";

const PROMOTIONS_API_URL = "http://localhost:3001/promotions";

export const getPromotions = async (): Promise<Promotion[]> => {
  const response = await fetch(PROMOTIONS_API_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch promotions");
  }
  return response.json();
};
