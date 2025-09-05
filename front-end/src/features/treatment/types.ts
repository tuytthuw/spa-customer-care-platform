export interface TreatmentSession {
  id: string;
  treatmentPlanStep: number;
  serviceId: string[];
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
  serviceId?: string;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  description: string;
  categories: string[];
  steps: TreatmentPlanStep[];
  price: number;
  imageUrl: string;
  status: "active" | "inactive";
  totalSessions: number;
}

export interface TreatmentPlanStep {
  step: number;
  serviceIds: string[];
}
