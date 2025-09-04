// src/features/billing/hooks/useInvoices.ts
import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/features/billing/api/invoice.api";
import { Invoice } from "@/features/billing/types";

export const useInvoices = () => {
  return useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
};
