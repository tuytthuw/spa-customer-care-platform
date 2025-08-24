"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockAppointments, mockCustomers, mockServices } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
}

const CustomerProfileModal = ({
  isOpen,
  onClose,
  customerId,
}: CustomerProfileModalProps) => {
  if (!customerId) return null;

  // Lấy dữ liệu mẫu
  const customer = mockCustomers.find((c) => c.id === customerId);
  const customerAppointments = mockAppointments.filter(
    (app) => app.id.includes(customerId.slice(-1)) && app.status === "completed"
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${customer?.id}`}
              />
              <AvatarFallback>{customer?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{customer?.name}</DialogTitle>
              <DialogDescription>
                {customer?.email} | {customer?.phone}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator />
        <ScrollArea className="max-h-[60vh]">
          <div className="p-1 pr-4">
            <h3 className="font-semibold mb-2">Lịch sử dịch vụ & Ghi chú</h3>
            <div className="space-y-4">
              {customerAppointments.map((app) => {
                const service = mockServices.find(
                  (s) => s.id === app.serviceId
                );
                return (
                  <div key={app.id} className="p-3 bg-muted/50 rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{service?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(app.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    {app.technicianNotes ? (
                      <p className="text-sm mt-1 border-l-2 border-primary pl-2">
                        <strong>Ghi chú:</strong> {app.technicianNotes}
                      </p>
                    ) : (
                      <p className="text-sm mt-1 text-muted-foreground italic">
                        Chưa có ghi chú cho lần này.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerProfileModal;
