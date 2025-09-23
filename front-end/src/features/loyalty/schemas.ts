// src/features/loyalty/schemas.ts
import { z } from "zod";

// Schema cho một hạng thành viên
const loyaltyTierSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3, "Tên hạng phải có ít nhất 3 ký tự."),
  pointGoal: z.number().min(0, "Mốc điểm không được âm."),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Mã màu không hợp lệ."),
  benefits: z.string().trim().min(10, "Mô tả quyền lợi ít nhất 10 ký tự."),
});

// Schema cho toàn bộ form cài đặt
export const loyaltySettingsSchema = z.object({
  pointsPerVnd: z.number().min(1, "Tỷ lệ quy đổi phải là số dương."),
  tiers: z.array(loyaltyTierSchema),
});

export type LoyaltySettingsFormValues = z.infer<typeof loyaltySettingsSchema>;
