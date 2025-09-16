export type AppointmentStatus =
  | "upcoming"
  | "completed"
  | "cancelled"
  | "checked-in"
  | "in-progress"
  | "no-show";

export type PaymentStatus = "paid" | "unpaid";

export type Appointment = {
  id: string;
  customerId: string;
  serviceId: string;
  technicianId?: string;
  resourceId?: string;
  date: string;
  status: AppointmentStatus;
  paymentStatus?: PaymentStatus;
  technicianNotes?: string;
  customerNote?: string;
  // Các trường dành cho khách vãng lai
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
};
