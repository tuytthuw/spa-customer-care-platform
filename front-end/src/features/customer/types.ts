export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  avatar?: string;
  totalAppointments: number;
  lastVisit: string; // ISO date string
  notes?: string;
}
