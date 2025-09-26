export type AppointmentStatus =
  | "upcoming"
  | "completed"
  | "cancelled"
  | "checked-in"
  | "in-progress"
  | "no-show"
  | "paused";

export type PaymentStatus = "paid" | "unpaid";

export type Appointment = {
  id: string;
  customerId: string;
  serviceId: string;
  technicianId?: string;
  resourceId?: string;
  start: string;
  end: string;
  status: AppointmentStatus;
  paymentStatus?: PaymentStatus;
  treatmentPackageId?: string;
  treatmentSessionId?: string;
  technicianNotes?: string;
  customerNote?: string;
  cancellationReason?: string;
  // Các trường dành cho khách vãng lai
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
};
