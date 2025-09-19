// src/features/schedule/components/ActionRequiredList.tsx
"use client";

import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointment } from "@/features/appointment/api/appointment.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import các types cần thiết
import {
  
  FullCustomerProfile,
} from "@/features/customer/types";
import { TreatmentPackage } from "@/features/treatment/types";
import { Service } from "@/features/service/types";

// Định nghĩa kiểu cho props
interface ActionRequiredListProps {
  treatments: TreatmentPackage[];
  services: Service[];
  currentUserProfile: FullCustomerProfile;
  // Thêm các props khác nếu cần
}

export default function ActionRequiredList({
  treatments,
  services,
  currentUserProfile,
}: ActionRequiredListProps) {
  const queryClient = useQueryClient();

  // Mutation để tạo lịch hẹn khi người dùng click "Đặt lịch"
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Đã tạo lịch hẹn mới trên lịch!", {
        description: "Vui lòng chọn ngày giờ và hoàn tất thông tin.",
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => toast.error(`Tạo lịch hẹn thất bại: ${error.message}`),
  });

  const handleBookNow = (serviceId: string) => {
    createAppointmentMutation.mutate({
      customerId: currentUserProfile.id,
      serviceId: serviceId,
      date: new Date().toISOString(), // Tạo tạm với ngày hiện tại, người dùng sẽ kéo thả sau
      paymentStatus: "paid",
    });
  };

  const actionableItems = useMemo(() => {
    const items: {
      id: string;
      name: string;
      description: string;
      serviceId: string;
    }[] = [];

    (currentUserProfile.purchasedServices || []).forEach((ps) => {
      if (ps.quantity > 0) {
        const serviceInfo = services.find((s) => s.id === ps.serviceId);
        if (serviceInfo) {
          items.push({
            id: `service-${ps.serviceId}`,
            name: serviceInfo.name,
            description: `Dịch vụ lẻ - Còn lại ${ps.quantity} lần`,
            serviceId: ps.serviceId,
          });
        }
      }
    });

    // Logic tương tự cho liệu trình sẽ được thêm ở đây

    return items;
  }, [currentUserProfile, services, treatments]);

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-4 pr-4">
        {actionableItems.length > 0 ? (
          actionableItems.map((item) => (
            <Card key={item.id} className="shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-semibold">
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter className="p-2 pt-0">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleBookNow(item.serviceId)}
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Đặt lịch
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center p-4">
            Không có mục nào cần thực hiện.
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
