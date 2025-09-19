import { Promotion } from "@/features/promotion/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPromotions = async (): Promise<Promotion[]> => {
  const response = await fetch(`${API_URL}/promotions`);
  if (!response.ok) {
    throw new Error("Failed to fetch promotions");
  }
  return response.json();
};
