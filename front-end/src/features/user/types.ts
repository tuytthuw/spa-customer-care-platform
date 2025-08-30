export interface User {
  id: string;
  email: string;
  password?: string;
  role: "customer" | "receptionist" | "technician" | "manager";
  status: "active" | "inactive";
}
