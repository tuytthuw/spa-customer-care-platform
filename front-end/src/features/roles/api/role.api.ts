import { v4 as uuidv4 } from "uuid";
import { Role } from "@/features/roles/types";
import { RoleFormValues } from "../schemas";

const ROLES_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/roles`;

export const getRoles = async (): Promise<Role[]> => {
  const response = await fetch(ROLES_API_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch roles.");
  return response.json();
};

export const addRole = async (data: RoleFormValues): Promise<Role> => {
  const newRole = {
    ...data,
    id: `role-${uuidv4()}`,
    status: "active",
  };
  const response = await fetch(ROLES_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRole),
  });
  if (!response.ok) throw new Error("Failed to add role.");
  return response.json();
};

export const updateRole = async (
  id: string,
  data: RoleFormValues
): Promise<Role> => {
  const response = await fetch(`${ROLES_API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update role.");
  return response.json();
};

export const deleteRole = async (id: string): Promise<void> => {
  const response = await fetch(`${ROLES_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete role.");
};
