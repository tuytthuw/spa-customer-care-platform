// src/features/prepaid-card/api/prepaid-card.api.ts
import { PrepaidCard } from "@/features/prepaid-card/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PREPAID_CARDS_API_URL = `${API_URL}/prepaidCards`;

/**
 * Lấy thông tin thẻ trả trước của một khách hàng dựa trên ID của khách hàng.
 * Một khách hàng có thể có nhiều thẻ, nhưng trong ví dụ này chúng ta giả định mỗi người chỉ có một.
 * @param customerId - ID của khách hàng
 * @returns - Một mảng các thẻ trả trước của khách hàng, hoặc mảng rỗng nếu không có.
 */
export const getPrepaidCardByCustomerId = async (
  customerId: string
): Promise<PrepaidCard[]> => {
  if (!customerId) return [];

  try {
    const response = await fetch(
      `${PREPAID_CARDS_API_URL}?customerId=${customerId}`,
      {
        cache: "no-store", // Đảm bảo luôn lấy dữ liệu mới nhất
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch prepaid card data.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching prepaid card by customer ID:", error);
    return [];
  }
};
