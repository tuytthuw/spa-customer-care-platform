"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/features/shared/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/avatar";
import { Separator } from "@/features/shared/components/ui/separator";
import { ScrollArea } from "@/features/shared/components/ui/scroll-area";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import { getCustomers } from "@/features/customer/api/customer.api";
import { getServices } from "@/features/service/api/service.api";
import { Appointment } from "@/features/appointment/types";
import { FullCustomerProfile } from "@/features/customer/types";
import { Service } from "@/features/service/types";

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
  // **MỚI: Fetch dữ liệu cần thiết từ API**
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled: !!customerId,
  });
  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments"],
    queryFn: getAppointments,
    enabled: !!customerId,
  });
  const { data: services = [], isLoading: loadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
    enabled: !!customerId,
  });

  const isLoading = loadingCustomers || loadingAppointments || loadingServices;

  if (!customerId) return null;

  // Tìm khách hàng và lịch sử hẹn của họ từ dữ liệu đã fetch
  const customer = customers.find((c) => c.id === customerId);
  const customerAppointments = appointments.filter(
    (app) => app.customerId === customerId && app.status === "completed"
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {isLoading ? (
          <div>Đang tải hồ sơ...</div>
        ) : !customer ? (
          <DialogHeader>
            <DialogTitle>Không tìm thấy khách hàng</DialogTitle>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      customer.avatar ||
                      `https://api.dicebear.com/7.x/notionists/svg?seed=${customer.id}`
                    }
                  />
                  <AvatarFallback>{customer.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-2xl">
                    {customer.name}
                  </DialogTitle>
                  <DialogDescription>
                    {customer.email} | {customer.phone}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <Separator />
            <ScrollArea className="max-h-[60vh]">
              <div className="p-1 pr-4">
                <h3 className="font-semibold mb-2">
                  Lịch sử dịch vụ & Ghi chú
                </h3>
                <div className="space-y-4">
                  {customerAppointments.length > 0 ? (
                    customerAppointments.map((app) => {
                      const service = services.find(
                        (s) => s.id === app.serviceId
                      );
                      return (
                        <div
                          key={app.id}
                          className="p-3 bg-muted/50 rounded-md"
                        >
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
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Chưa có lịch sử dịch vụ nào.
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerProfileModal;
