export interface PurchasedService {
  serviceId: string;
  quantity: number;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  avatar?: string;
  totalAppointments: number;
  lastVisit: string; // ISO date string
  notes?: string;
  purchasedServices?: PurchasedService[];
  preferences?: {
    allergies?: string;
    serviceNotes?: string;
    favoriteTechnicianIds?: string[];
  };
  notificationSettings?: {
    allowPromotions: boolean;
    allowReminders: boolean;
  };
  loyaltyPoints?: number;
  rank?: "Bronze" | "Silver" | "Gold";
  joinedDate: string;
}

export type FullCustomerProfile = Customer & {
  email: string;
  status: "active" | "inactive";
};
