import { notFound } from "next/navigation";
import { getCustomerById } from "@/features/customer/api/customer.api";
import { getAppointmentsByCustomerId } from "@/features/appointment/api/appointment.api";
import { CustomerProfileCard } from "@/features/customer/components/CustomerProfileCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/shared/components/ui/tabs";
import AppointmentHistory from "@/features/customer/components/AppointmentHistory";
import { DashboardDetailPageLayout } from "@/features/shared/components/common/DashboardDetailPageLayout";

interface CustomerDetailPageProps {
  params: { customerId: string };
}

// Chuyển thành Server Component để tải dữ liệu ở server
export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { customerId } = params;

  // Tải dữ liệu cần thiết song song để tối ưu tốc độ
  const [customer, customerAppointments] = await Promise.all([
    getCustomerById(customerId),
    getAppointmentsByCustomerId(customerId), // Tải sẵn lịch sử hẹn
  ]);

  // Nếu không tìm thấy khách hàng, hiển thị trang 404
  if (!customer) {
    notFound();
  }

  return (
    // Sử dụng lại DetailPageLayout để có giao diện đồng nhất
    <DashboardDetailPageLayout
      title={customer.name}
      sidebar={<CustomerProfileCard customer={customer} />}
      backHref="/customers"
    >
      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments">Lịch sử hẹn</TabsTrigger>
          <TabsTrigger value="treatments">Liệu trình đã mua</TabsTrigger>
          <TabsTrigger value="notes">Ghi chú</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          {/* Truyền dữ liệu lịch sử hẹn đã tải sẵn xuống component con */}
          <AppointmentHistory appointments={customerAppointments} />
        </TabsContent>
        <TabsContent value="treatments">
          {/* TODO: Component cho liệu trình đã mua */}
        </TabsContent>
        <TabsContent value="notes">
          {/* TODO: Component cho ghi chú */}
        </TabsContent>
      </Tabs>
    </DashboardDetailPageLayout>
  );
}
