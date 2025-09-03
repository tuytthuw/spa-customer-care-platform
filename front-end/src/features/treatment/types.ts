export interface TreatmentSession {
  id: string;
  date: string;
  technicianId: string;
  notes: string;
  status: "completed" | "upcoming";
}

export interface TreatmentPackage {
  id: string;
  customerId: string;
  treatmentPlanId: string;
  serviceId: string;
  totalSessions: number;
  completedSessions: number;
  purchaseDate: string;
  sessions: TreatmentSession[];
}

export interface TreatmentPlan {
  id: string;
  name: string;
  description: string;
  category: string;
  serviceIds: string[];
  price: number;
  totalSessions: number; // Tổng số buổi trong liệu trình
  imageUrl: string;
  status: "active" | "inactive";
}
