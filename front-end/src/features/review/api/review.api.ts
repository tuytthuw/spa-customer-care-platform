// src/features/review/api/review.api.ts
import { v4 as uuidv4 } from "uuid";
import { Review, NewReviewData } from "@/features/review/types";

const REVIEWS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/reviews`;

// Lấy tất cả đánh giá
export const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch(REVIEWS_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch reviews.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// Tạo một đánh giá mới
export const createReview = async (
  reviewData: NewReviewData
): Promise<Review> => {
  const newReview = {
    ...reviewData,
    id: `rev-${uuidv4()}`,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(REVIEWS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newReview),
  });

  if (!response.ok) {
    throw new Error("Failed to create review.");
  }

  return await response.json();
};
