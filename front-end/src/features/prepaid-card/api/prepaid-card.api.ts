// src/features/prepaid-card/api/prepaid-card.api.ts
import { PrepaidCard } from "@/features/prepaid-card/types";
import { v4 as uuidv4 } from "uuid";

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

/**
 * Ghi nợ (trừ tiền) vào thẻ trả trước.
 * @param cardId - ID của thẻ cần trừ tiền
 * @param amount - Số tiền cần trừ (là một số dương)
 * @param invoiceId - ID của hóa đơn để ghi vào lịch sử giao dịch
 * @returns - Thẻ trả trước sau khi đã được cập nhật.
 */
export const debitPrepaidCard = async (
  cardId: string,
  amount: number,
  invoiceId: string
): Promise<PrepaidCard> => {
  // Lấy thông tin thẻ hiện tại
  const cardRes = await fetch(`${PREPAID_CARDS_API_URL}/${cardId}`);
  if (!cardRes.ok) throw new Error("Không tìm thấy thẻ trả trước.");
  const card: PrepaidCard = await cardRes.json();

  if (card.balance < amount) {
    throw new Error("Số dư thẻ không đủ để thực hiện thanh toán.");
  }

  // Tạo một giao dịch mới
  const newTransaction: PrepaidCardTransaction = {
    id: `pct-${uuidv4()}`,
    type: "payment",
    amount: -amount, // Ghi số âm vì đây là giao dịch trừ tiền
    description: `Thanh toán cho hóa đơn #${invoiceId.slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const updatedCard: PrepaidCard = {
    ...card,
    balance: card.balance - amount,
    history: [...card.history, newTransaction],
  };

  // Cập nhật lại toàn bộ đối tượng thẻ trên server
  const response = await fetch(`${PREPAID_CARDS_API_URL}/${cardId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedCard),
  });

  if (!response.ok) {
    throw new Error("Cập nhật số dư thẻ trả trước thất bại.");
  }

  return response.json();
};
