import { Appointment } from "./appointment";
import { Product } from "./product";

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  type: "service" | "product";
}

export interface Invoice {
  id: string;
  appointmentId: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer" | null;
  status: "pending" | "paid";
  createdAt: string;
}
