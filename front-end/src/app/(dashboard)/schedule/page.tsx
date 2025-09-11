"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Appointment } from "@/features/appointment/types";
import { Customer } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { FullStaffProfile } from "@/features/staff/types";
import {
  getAppointments,
  logAppointmentCompletion,
} from "@/features/appointment/api/appointment.api";
import { getCustomers } from "@/features/customer/api/customer.api";
import { getServices } from "@/features/service/api/service.api";
import { getStaffProfiles } from "@/features/staff/api/staff.api";
import { useAuth } from "@/contexts/AuthContexts";
import { AppointmentDetailsModal } from "@/features/schedule/components/AppointmentDetailsModal";
import { Card, CardContent } from "@/components/ui/card";
import { RegisterScheduleModal } from "@/features/schedule/components/RegisterScheduleModal";
import { toast } from "sonner";
import { ScheduleRegistrationData } from "@/features/schedule/types";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";

export default function SchedulePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: staffProfiles = [], isLoading: loadingStaff } = useQuery<
    FullStaffProfile[]
  >({
    queryKey: ["staffProfiles"],
    queryFn: getStaffProfiles,
    enabled: !!user,
  });

  const currentTechnician = staffProfiles.find((s) => s.userId === user?.id);

  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments", currentTechnician?.id],
    queryFn: getAppointments,
    enabled: !!currentTechnician,
  });

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    Customer[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: services = [], isLoading: loadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      logAppointmentCompletion(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", currentTechnician?.id],
      });
      toast.success("Đã cập nhật trạng thái lịch hẹn.");
      setIsDetailsModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Cập nhật thất bại: ${error.message}`);
    },
  });

  const isLoading =
    loadingStaff || loadingAppointments || loadingCustomers || loadingServices;

  const dailyAppointments = appointments.filter((app) => {
    const appDate = new Date(app.date);
    const selectedDate = date || new Date();
    // **SỬA LỖI LOGIC**: Chỉ lọc lịch hẹn của đúng kỹ thuật viên này
    return (
      app.technicianId === currentTechnician?.id &&
      appDate.toDateString() === selectedDate.toDateString()
    );
  });

  const handleAppointmentClick = (appointment: Appointment) => {
    // Tìm customer và service tương ứng từ danh sách đã fetch
    const customer = customers.find((c) => c.id === appointment.customerId);
    const service = services.find((s) => s.id === appointment.serviceId);

    setSelectedAppointment(appointment);
    setSelectedCustomer(customer || null); // Lưu customer vào state
    setSelectedService(service || null); // Lưu service vào state
    setIsDetailsModalOpen(true);
  };

  const handleUpdateAppointment = (id: string, notes: string) => {
    updateAppointmentMutation.mutate({ id, notes });
  };

  const handleSaveSchedule = (scheduleData: ScheduleRegistrationData) => {
    console.log("Saving schedule registration:", {
      staffId: currentTechnician?.id,
      status: "pending",
      ...scheduleData,
    });
    toast.success("Đã gửi yêu cầu đăng ký lịch tuần tới.");
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <PageHeader
          title="Lịch làm việc"
          actionNode={
            <Button onClick={() => setIsRegisterModalOpen(true)}>
              Đăng ký lịch tuần tới
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="p-3"
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              Lịch hẹn ngày {date ? date.toLocaleDateString("vi-VN") : ""}
            </h2>
            <div className="space-y-4">
              {isLoading ? (
                <p>Đang tải lịch hẹn...</p>
              ) : dailyAppointments.length > 0 ? (
                // **THAY ĐỔI: Hiển thị dữ liệu động**
                dailyAppointments.map((app) => {
                  const service = services.find((s) => s.id === app.serviceId);
                  const customer = customers.find(
                    (c) => c.id === app.customerId
                  );
                  if (!service || !customer) return null;

                  return (
                    <button
                      key={app.id}
                      onClick={() => handleAppointmentClick(app)}
                      className="w-full text-left"
                    >
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <p className="font-semibold">
                            {`${new Date(app.date).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} - ${service.name}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Khách hàng: {customer.name}
                          </p>
                        </CardContent>
                      </Card>
                    </button>
                  );
                })
              ) : (
                <p>Không có lịch hẹn nào trong ngày này.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
        customer={selectedCustomer}
        service={selectedService}
        onUpdateAppointment={handleUpdateAppointment}
      />
      <RegisterScheduleModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSave={handleSaveSchedule}
      />
    </>
  );
}
