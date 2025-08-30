// src/services/resourceService.ts
import { Resource } from "@/types/resource";

const RESOURCES_API_URL = "http://localhost:3001/resources";

export const getResources = async (): Promise<Resource[]> => {
  try {
    const response = await fetch(RESOURCES_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch resources.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
};
