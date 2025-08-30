"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/features/customer/types";
import { Appointment } from "@/features/appointment/types";
import {
  getCustomers,
  FullCustomerProfile,
} from "@/features/customer/api/customer.api";
import { getAppointments } from "@/features/appointment/api/appointment.api";
import { CustomerProfileCard } from "@/features/customer/components/CustomerProfileCard";
import { AppointmentHistory } from "@/features/customer/components/AppointmentHistory";
import { Service } from "@/features/service/types";
import { getServices } from "@/features/service/api/service.api";
import { Staff } from "@/features/staff/types";
import { getStaff } from "@/features/staff/api/staff.api";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.customerId as string;

  // Fetch dữ liệu cho khách hàng cụ thể và các dữ liệu liên quan
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: appointments = [], isLoading: loadingAppointments } = useQuery<
    Appointment[]
  >({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  const { data: services = [], isLoading: loadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { data: staff = [], isLoading: loadingStaff } = useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  const isLoading =
    loadingCustomers || loadingAppointments || loadingServices || loadingStaff;

  if (isLoading) {
    return <div className="p-8">Đang tải hồ sơ khách hàng...</div>;
  }

  const customer = customers.find((c) => c.id === customerId);
  const customerAppointments = appointments.filter(
    (app) => app.customerId === customerId
  );

  if (!customer) {
    return <div className="p-8">Không tìm thấy khách hàng.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CustomerProfileCard customer={customer} />
        </div>
        <div className="lg:col-span-2">
          <AppointmentHistory
            appointments={customerAppointments}
            services={services}
            staff={staff}
          />
        </div>
      </div>
    </div>
  );
}
