// src/features/prepaid-card/types.ts

// Định nghĩa loại giao dịch: "deposit" là nạp tiền, "payment" là dùng tiền trong thẻ để thanh toán
export type PrepaidCardTransactionType = "deposit" | "payment";

// Ghi lại thông tin của mỗi giao dịch trên thẻ
export interface PrepaidCardTransaction {
  id: string;
  type: PrepaidCardTransactionType;
  amount: number; // Số tiền giao dịch
  description: string; // Mô tả, ví dụ: "Nạp tiền vào thẻ" hoặc "Thanh toán cho hóa đơn #inv-123"
  createdAt: string; // Thời gian giao dịch (ISO date string)
}

// Đại diện cho một thẻ trả trước hoàn chỉnh của khách hàng
export interface PrepaidCard {
  id: string;
  customerId: string;
  cardNumber: string; // Số thẻ (có thể che một phần để bảo mật trên giao diện)
  balance: number; // Số dư hiện tại
  initialBalance: number; // Số dư ban đầu khi mua thẻ
  createdAt: string; // Ngày tạo/mua thẻ
  history: PrepaidCardTransaction[]; // Lịch sử của tất cả các giao dịch
}
