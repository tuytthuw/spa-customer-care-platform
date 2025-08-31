export interface Staff {
  id: string;
  userId: string;
  name: string;
  phone: string;
  role: "technician" | "receptionist" | "manager";
  avatar?: string;
  serviceIds?: string[];
}
export type FullStaffProfile = Staff & {
  email: string;
  status: "active" | "inactive";
};
