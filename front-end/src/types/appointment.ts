export type AppointmentStatus =
  | "upcoming"
  | "completed"
  | "cancelled"
  | "checked-in"
  | "in-progress"
  | "no-show";

export type Appointment = {
  id: string;
  customerId: string;
  serviceId: string;
  technicianId?: string;
  date: string;
  status: AppointmentStatus;
  technicianNotes?: string;
};
