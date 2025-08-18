export type Status =
  | "PENDING"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED";

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  start: string; // ISO
  end: string; // ISO
  status: Status;
  notes?: string;
}

export interface AppointmentInput {
  serviceId: string;
  serviceName: string;
  start: string; // ISO
  end: string; // ISO
}
