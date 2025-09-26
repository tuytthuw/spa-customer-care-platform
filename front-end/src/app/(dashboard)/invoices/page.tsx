"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContexts";
import { Invoice } from "@/features/billing/types";
import { getInvoicesByCustomerId } from "@/features/billing/api/invoice.api";
import { useCustomers } from "@/features/customer/hooks/useCustomers";

import { DataTable } from "@/features/shared/components/ui/data-table";
import { columns } from "./columns";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import { Button } from "@/features/shared/components/ui/button";
import InvoiceReceipt from "@/features/billing/components/InvoiceReceipt";
import { Printer, X } from "lucide-react";
export default function InvoicesPage() {
  const { user } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();

  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  const { data: invoices = [], isLoading: loadingInvoices } = useQuery<
    Invoice[]
  >({
    queryKey: ["invoices", currentUserProfile?.id],
    queryFn: () => getInvoicesByCustomerId(currentUserProfile!.id),
    enabled: !!currentUserProfile,
  });

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handlePrint = () => window.print();

  const isLoading = loadingCustomers || loadingInvoices;

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!currentUserProfile) {
    return <div className="p-6">Không tìm thấy thông tin khách hàng.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Hóa đơn của tôi" />
      <DataTable
        columns={columns({ onViewDetails: handleViewDetails })}
        data={invoices}
      />

      <Dialog
        open={!!selectedInvoice}
        onOpenChange={(isOpen) => !isOpen && setSelectedInvoice(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn</DialogTitle>
          </DialogHeader>
          <div className="printable-receipt">
            {selectedInvoice && (
              <InvoiceReceipt
                invoice={selectedInvoice}
                customer={currentUserProfile}
              />
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
              <X className="mr-2 h-4 w-4" /> Đóng
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> In hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
