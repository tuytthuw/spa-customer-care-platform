"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@/features/appointment/types";
import { NewReviewData } from "@/features/review/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "@/features/customer-schedules/components/AppointmentCard";
import { ReviewModal } from "@/features/review/components/ReviewModal";
import {
  getAppointments,
  updateAppointmentStatus,
} from "@/features/appointment/api/appointment.api";
import { createReview } from "@/features/review/api/review.api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContexts";
import { PageHeader } from "@/components/common/PageHeader";
import { useTreatments } from "@/features/treatment/hooks/useTreatments";
import { useTreatmentPlans } from "@/features/treatment/hooks/useTreatmentPlans";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useServices } from "@/features/service/hooks/useServices";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useReviews } from "@/features/review/hooks/useReviews";
import { ReviewFormValues } from "@/features/review/schemas";
export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const { data: customers = [], isLoading: isLoadingCustomers } =
    useCustomers();

  const {
    data: appointments = [],
    isLoading: isLoadingAppointments,
    error: errorAppointments,
  } = useQuery<Appointment[]>({
    queryKey: ["appointments", user?.id], // **THAY ĐỔI: Thêm user.id vào queryKey**
    queryFn: getAppointments,
    enabled: !!user && !isLoadingCustomers, // **MỚI: Chỉ fetch khi có user và đã tải xong customer**
    select: (data) => {
      if (!user) return [];
      // Tìm customer profile tương ứng với user đang đăng nhập
      const currentUserProfile = customers.find((c) => c.userId === user.id);
      if (!currentUserProfile) return [];
      // Lọc appointment theo customerId tìm được
      return data.filter((a) => a.customerId === currentUserProfile.id);
    },
  });

  const {
    data: services = [],
    isLoading: isLoadingServices,
    error: errorServices,
  } = useServices();
  const {
    data: staff = [],
    isLoading: isLoadingStaff,
    error: errorStaff,
  } = useStaffs();

  const { data: reviews = [] } = useReviews();
  const { data: treatments = [] } = useTreatments();
  const { data: treatmentPlans = [] } = useTreatmentPlans();

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      setIsReviewModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Gửi đánh giá thất bại: ${error.message}`);
    },
  });

  const handleOpenReviewModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (values: ReviewFormValues) => {
    if (!selectedAppointment || !user || !selectedAppointment.technicianId) {
      toast.error("Thiếu thông tin để gửi đánh giá.");
      return;
    }
    const customerProfile = customers.find((c) => c.userId === user.id);
    if (!customerProfile) return;

    const reviewData: NewReviewData = {
      appointmentId: selectedAppointment.id,
      customerId: customerProfile.id,
      technicianId: selectedAppointment.technicianId,
      serviceId: selectedAppointment.serviceId,
      rating: values.rating, // Lấy từ đối tượng values
      comment: values.comment, // Lấy từ đối tượng values
      // Thêm các trường tùy chọn để khớp với type
      imageUrl: "",
      imageUrls: [],
    };
    createReviewMutation.mutate(reviewData);
  };

  // 2. Sử dụng useMutation để xử lý việc cập nhật trạng thái
  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "cancelled" }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      // Làm mới lại query "appointments" để cập nhật UI
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Hủy lịch hẹn thành công!");
    },
    onError: (error) => {
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
    },
  });

  // 3. Cập nhật hàm xử lý để gọi mutation
  const handleCancelAppointment = (id: string, reason: string) => {
    console.log(`Cancelling appointment ${id} for reason: ${reason}`);
    cancelAppointmentMutation.mutate({ id, status: "cancelled" });
  };

  // 4. Gộp các trạng thái loading và error
  const isLoading =
    isLoadingAppointments ||
    isLoadingServices ||
    isLoadingStaff ||
    isLoadingCustomers;
  const error = errorAppointments || errorServices || errorStaff;

  if (isLoading) {
    return <div className="p-8">Đang tải lịch hẹn của bạn...</div>;
  }

  if (error) {
    return (
      <div className="p-8">Đã xảy ra lỗi khi tải dữ liệu: {error.message}</div>
    );
  }

  // Lọc dữ liệu sau khi đã fetch xong
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "upcoming"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled"
  );

  // Hàm render danh sách lịch hẹn để tránh lặp code
  const renderAppointmentList = (list: Appointment[]) => {
    if (list.length === 0) {
      return <p>Không có lịch hẹn nào.</p>;
    }
    return list.map((appointment) => {
      // 5. Tìm kiếm service và technician từ dữ liệu đã fetch
      const service = services.find((s) => s.id === appointment.serviceId);
      const technician = staff.find((t) => t.id === appointment.technicianId);
      const hasReviewed = reviews.some(
        (r) => r.appointmentId === appointment.id
      );
      const treatmentPackage = treatments.find(
        (pkg) => pkg.id === appointment.treatmentPackageId
      );
      const treatmentPlan = treatmentPackage
        ? treatmentPlans.find(
            (plan) => plan.id === treatmentPackage.treatmentPlanId
          )
        : undefined;

      // Chỉ render khi có đủ thông tin dịch vụ
      if (!service) return null;

      return (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          service={service}
          technician={technician}
          treatmentPackage={treatmentPackage}
          treatmentPlan={treatmentPlan}
          onCancel={handleCancelAppointment}
          onReview={handleOpenReviewModal}
          hasReviewed={hasReviewed}
        />
      );
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Lịch hẹn của tôi" />
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Sắp tới ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã hoàn thành ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Đã hủy ({cancelledAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="space-y-4">
            {renderAppointmentList(upcomingAppointments)}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div className="space-y-4">
            {renderAppointmentList(completedAppointments)}
          </div>
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <div className="space-y-4">
            {renderAppointmentList(cancelledAppointments)}
          </div>
        </TabsContent>
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
          itemName={
            services.find((s) => s.id === selectedAppointment?.serviceId)
              ?.name || "Dịch vụ"
          }
          isSubmitting={createReviewMutation.isPending}
        />
      </Tabs>
    </div>
  );
}
