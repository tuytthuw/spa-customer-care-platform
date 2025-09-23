// src/features/loyalty/types.ts

// Định nghĩa cấu trúc cho một hạng thành viên
export interface LoyaltyTier {
  id: string;
  name: string; // Ví dụ: "Đồng", "Bạc", "Vàng"
  pointGoal: number; // Số điểm cần đạt để lên hạng này
  color: string; // Mã màu để hiển thị (ví dụ: #cd7f32)
  benefits: string; // Mô tả quyền lợi, mỗi quyền lợi cách nhau bằng dấu chấm phẩy
}

// Định nghĩa cấu trúc cho toàn bộ cài đặt của chương trình khách hàng thân thiết
export interface LoyaltySettings {
  pointsPerVnd: number; // Tỷ lệ quy đổi: 1 điểm = ? VNĐ
  tiers: LoyaltyTier[];
}
