import { z } from "zod";

export const marketingEmailSchema = z.object({
  subject: z.string().trim().min(5, "Tiêu đề phải có ít nhất 5 ký tự."),
  content: z.string().trim().min(20, "Nội dung phải có ít nhất 20 ký tự."),
});

export type MarketingEmailFormValues = z.infer<typeof marketingEmailSchema>;
