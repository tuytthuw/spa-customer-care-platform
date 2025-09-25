import { Invoice } from "@/features/billing/types";
import { v4 as uuidv4 } from "uuid";
import { Customer } from "@/features/customer/types";
import { Product } from "@/features/product/types";
import { redeemLoyaltyPoints } from "@/features/customer/api/customer.api";
import { debitPrepaidCard } from "@/features/prepaid-card/api/prepaid-card.api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const INVOICES_API_URL = `${API_URL}/invoices`;
const CUSTOMERS_API_URL = `${API_URL}/customers`;
const PRODUCTS_API_URL = `${API_URL}/products`;
const POINTS_PER_VND = 1 / 10000;

export type InvoiceCreationData = Omit<
  Invoice,
  "id" | "createdAt" | "updatedAt" | "totalAmount"
> & {
  pointsToRedeem?: number;
  prepaidCardId?: string;
  prepaidAmountToUse?: number;
};

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
    const newInvoiceId = `inv-${uuidv4()}`;
    const { customerId, pointsToRedeem, prepaidCardId, prepaidAmountToUse } =
      invoiceData;

    // BƯỚC 1: XỬ LÝ CÁC KHOẢN THANH TOÁN ĐẶC BIỆT TRƯỚC
    if (pointsToRedeem && pointsToRedeem > 0) {
      await redeemLoyaltyPoints(customerId, pointsToRedeem);
    }
    if (prepaidCardId && prepaidAmountToUse && prepaidAmountToUse > 0) {
      await debitPrepaidCard(prepaidCardId, prepaidAmountToUse, newInvoiceId);
    }

    // BƯỚC 2: TẠO HÓA ĐƠN SAU KHI ĐÃ XỬ LÝ CÁC KHOẢN TRỪ
    const response = await fetch(INVOICES_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...invoiceData,
        id: newInvoiceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalAmount: invoiceData.total, // totalAmount sẽ bằng total
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create invoice.");
    }

    const newInvoice: Invoice = await response.json();

    // BƯỚC 3: CẬP NHẬT DỊCH VỤ ĐÃ MUA CHO KHÁCH HÀNG
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

    // BƯỚC 4: TRỪ KHO SẢN PHẨM ĐÃ BÁN
    const productsToUpdate = newInvoice.items.filter(
      (item) => item.type === "product"
    );

    if (productsToUpdate.length > 0) {
      for (const item of productsToUpdate) {
        const productRes = await fetch(`${PRODUCTS_API_URL}/${item.id}`);
        if (productRes.ok) {
          const product: Product = await productRes.json();
          const newStock = product.stock - item.quantity;
          await fetch(`${PRODUCTS_API_URL}/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: newStock >= 0 ? newStock : 0 }),
          });
        }
      }
    }

    // BƯỚC 5: CỘNG ĐIỂM TÍCH LŨY CHO SỐ TIỀN THỰC TRẢ (NẾU CÓ)
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
