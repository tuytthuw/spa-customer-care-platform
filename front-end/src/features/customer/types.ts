export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  avatar?: string;
  totalAppointments: number;
  lastVisit: string; // ISO date string
  notes?: string;
  preferences?: {
    allergies?: string;
    serviceNotes?: string;
    favoriteTechnicianIds?: string[];
  };
  notificationSettings?: {
    allowPromotions: boolean;
    allowReminders: boolean;
  };
}

export type FullCustomerProfile = Customer & {
  email: string;
  status: "active" | "inactive";
};
