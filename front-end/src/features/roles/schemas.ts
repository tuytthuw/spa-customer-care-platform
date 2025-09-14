import { z } from "zod";
import { nameSchema, descriptionSchema } from "@/lib/schemas";
import { FEATURES, PERMISSIONS } from "./types";

// Tạo một schema động dựa trên danh sách các tính năng
const permissionsSchema = z.object(
  Object.fromEntries(
    Object.values(FEATURES).map((feature) => [
      feature,
      z.array(z.nativeEnum(PERMISSIONS)).optional(),
    ])
  )
);

export const roleFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(),
  permissions: permissionsSchema,
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
