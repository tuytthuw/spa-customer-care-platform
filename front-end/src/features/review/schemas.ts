import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.number().min(1, "Vui lòng chọn ít nhất 1 sao."),
  comment: z
    .string()
    .trim()
    .min(10, { message: "Bình luận cần ít nhất 10 ký tự." }),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
