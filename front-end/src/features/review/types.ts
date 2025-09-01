// src/features/review/types.ts
export interface Review {
  id: string;
  appointmentId: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type NewReviewData = Omit<Review, "id" | "createdAt">;
