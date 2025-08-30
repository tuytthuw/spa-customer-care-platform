// src/types/resource.ts
export interface Resource {
  id: string;
  name: string;
  type: "room" | "equipment";
  status: "available" | "in_use" | "maintenance";
  notes?: string;
}
