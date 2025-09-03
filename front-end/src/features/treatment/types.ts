export interface TreatmentSession {
  id: string;
  treatmentPlanStep: number;
  serviceId: string;
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
}

export interface TreatmentPlanStep {
  step: number;
  serviceId: string;
}
