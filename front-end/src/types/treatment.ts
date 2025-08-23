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
  serviceId: string;
  totalSessions: number;
  completedSessions: number;
  purchaseDate: string;
  sessions: TreatmentSession[];
}
