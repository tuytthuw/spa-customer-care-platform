export interface TreatmentSession {
  id: string;
  treatmentPlanStep: number;
  serviceIds: string[];
  date: string;
  technicianId: string;
  notes: string;
  status: "completed" | "upcoming";
}

export interface TreatmentPackage {
  id: string;
  customerId: string;
  treatmentPlanId: string;
  purchaseDate: string;
  sessions: TreatmentSession[];
  totalSessions: number;
  completedSessions: number;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  description: string;
  categories: string[];
  steps: TreatmentPlanStep[];
  price: number;
  imageUrl: string;
  imageUrls: string[];
  status: "active" | "inactive";
  totalSessions: number;
}

export interface TreatmentPlanStep {
  step: number;
  serviceIds: string[];
}
