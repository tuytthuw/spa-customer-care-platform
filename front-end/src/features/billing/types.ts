export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  type: "service" | "product" | "treatment";
}

export interface Invoice {
  id: string;
  appointmentId?: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: "pending" | "paid";
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  totalAmount: number;
}

export type PaymentMethod = "cash" | "card" | "transfer" | "cod" | "combined";
