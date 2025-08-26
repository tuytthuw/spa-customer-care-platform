export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  lastVisit: string; // ISO date string
  password?: string;
  role?: "CLIENT";
  status: "active" | "inactive";
  notes?: string;
}
