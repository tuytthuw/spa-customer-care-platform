// src/services/invoiceService.ts
import { Invoice } from "@/types/invoice";
import { v4 as uuidv4 } from "uuid";

const INVOICES_API_URL = "http://localhost:3001/invoices";

// Lấy type Omit để loại bỏ các trường không cần thiết khi tạo mới
type InvoiceCreationData = Omit<Invoice, "id" | "createdAt">;

export const createInvoice = async (
  invoiceData: InvoiceCreationData
): Promise<Invoice> => {
  try {
    const response = await fetch(INVOICES_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...invoiceData,
        id: `inv-${uuidv4()}`,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create invoice.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};
