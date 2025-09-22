import { Invoice } from "@/features/billing/types";
import { v4 as uuidv4 } from "uuid";
import { Customer } from "@/features/customer/types";
import { Product } from "@/features/product/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const INVOICES_API_URL = `${API_URL}/invoices`;
const CUSTOMERS_API_URL = `${API_URL}/customers`;
const PRODUCTS_API_URL = `${API_URL}/products`;
const POINTS_PER_VND = 1 / 10000;

type InvoiceCreationData = Omit<Invoice, "id" | "createdAt">;

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await fetch(INVOICES_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch invoices.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

export const createInvoice = async (
  invoiceData: InvoiceCreationData
): Promise<Invoice> => {
  try {
    // BƯỚC 1: TẠO HÓA ĐƠN
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

    const newInvoice: Invoice = await response.json();

    // BƯỚC 2: CẬP NHẬT CÁC DỊCH VỤ ĐÃ MUA CHO KHÁCH HÀNG (Logic cũ)
    const servicesToUpdate = newInvoice.items.filter(
      (item) => item.type === "service"
    );

    if (servicesToUpdate.length > 0) {
      const customerRes = await fetch(
        `${CUSTOMERS_API_URL}/${newInvoice.customerId}`
      );
      if (customerRes.ok) {
        const customer: Customer = await customerRes.json();
        const purchasedServices = customer.purchasedServices || [];

        servicesToUpdate.forEach((item) => {
          const existingService = purchasedServices.find(
            (s) => s.serviceId === item.id
          );
          if (existingService) {
            existingService.quantity += item.quantity;
          } else {
            purchasedServices.push({
              serviceId: item.id,
              quantity: item.quantity,
            });
          }
        });

        await fetch(`${CUSTOMERS_API_URL}/${newInvoice.customerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purchasedServices }),
        });
      }
    }

    // BƯỚC 3: TRỪ KHO CÁC SẢN PHẨM ĐÃ BÁN (LOGIC MỚI)
    const productsToUpdate = newInvoice.items.filter(
      (item) => item.type === "product"
    );

    if (productsToUpdate.length > 0) {
      for (const item of productsToUpdate) {
        // Lấy thông tin sản phẩm hiện tại để biết tồn kho
        const productRes = await fetch(`${PRODUCTS_API_URL}/${item.id}`);
        if (productRes.ok) {
          const product: Product = await productRes.json();
          const newStock = product.stock - item.quantity;

          // Cập nhật lại tồn kho cho sản phẩm
          await fetch(`${PRODUCTS_API_URL}/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: newStock >= 0 ? newStock : 0 }), // Đảm bảo tồn kho không bị âm
          });
        }
      }
    }

    if (newInvoice.total > 0) {
      const customerRes = await fetch(
        `${CUSTOMERS_API_URL}/${newInvoice.customerId}`
      );
      if (customerRes.ok) {
        const customer: Customer = await customerRes.json();
        const pointsEarned = Math.floor(newInvoice.total * POINTS_PER_VND);

        if (pointsEarned > 0) {
          const currentPoints = customer.loyaltyPoints || 0;
          const newTotalPoints = currentPoints + pointsEarned;

          // (Tùy chọn) Logic nâng hạng có thể thêm ở đây sau

          await fetch(`${CUSTOMERS_API_URL}/${newInvoice.customerId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loyaltyPoints: newTotalPoints }),
          });
        }
      }
    }

    return newInvoice;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const getInvoicesByCustomerId = async (
  customerId: string
): Promise<Invoice[]> => {
  if (!customerId) return [];
  try {
    const response = await fetch(
      `${INVOICES_API_URL}?customerId=${customerId}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch invoices for customer.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching invoices by customer:", error);
    return [];
  }
};
