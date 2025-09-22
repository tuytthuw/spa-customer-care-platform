// src/app/(dashboard)/customers/[customerId]/page.tsx
import { notFound } from "next/navigation";
import { CustomerProfileCard } from "@/features/customer/components/CustomerProfileCard";
import { AppointmentHistory } from "@/features/customer/components/AppointmentHistory";
import { getServices } from "@/features/service/api/service.api";
import { getStaff } from "@/features/staff/api/staff.api";
import { getAppointmentsByCustomerId } from "@/features/appointment/api/appointment.api";
import { getCustomerById } from "@/features/customer/api/customer.api";

interface CustomerDetailPageProps {
  params: { customerId: string };
}

// Chuyển thành Server Component với async/await
export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { customerId } = params;

  // 1. Tải tất cả dữ liệu cần thiết một cách song song trên server
  const [customer, customerAppointments, services, staff] = await Promise.all([
    getCustomerById(customerId), // API call chuyên biệt
    getAppointmentsByCustomerId(customerId), // API call chuyên biệt
    getServices(), // Vẫn cần tải hết để map tên dịch vụ
    getStaff(), // Vẫn cần tải hết để map tên kỹ thuật viên
  ]);

  // 2. Nếu không tìm thấy khách hàng, trả về trang 404
  if (!customer) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
          {/* 3. Truyền dữ liệu đã được xử lý ở server xuống component con */}
          <CustomerProfileCard customer={customer} />
        </div>
        <div className="w-full lg:w-2/3">
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
