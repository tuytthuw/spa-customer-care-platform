// src/features/staff/schemas.ts
import { z } from "zod";
import { personSchema } from "@/lib/schemas"; // <-- Import schema chung

const ROLES = ["technician", "receptionist", "manager"] as const;
const STATUSES = ["active", "inactive"] as const;

// Mở rộng từ `personSchema` và thêm các trường riêng cho nhân viên
export const staffFormSchema = personSchema.extend({
  role: z.enum(ROLES, { message: "Vui lòng chọn vai trò." }),
  status: z.enum(STATUSES, { message: "Vui lòng chọn trạng thái." }),
  serviceIds: z.array(z.string()).optional(),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
