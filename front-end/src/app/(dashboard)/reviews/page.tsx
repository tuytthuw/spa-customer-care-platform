"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContexts";
import { toast } from "sonner";

// Import các types cần thiết
import { Appointment } from "@/features/appointment/types";
import { TreatmentPackage } from "@/features/treatment/types";
import { Product } from "@/features/product/types";
import { NewReviewData } from "@/features/review/types";
import { ReviewFormValues } from "@/features/review/schemas";

// Import các API actions
import { createReview } from "@/features/review/api/review.api";

// Import các custom hooks
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useAppointments } from "@/features/appointment/hooks/useAppointments";
import { useServices } from "@/features/service/hooks/useServices";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useReviews } from "@/features/review/hooks/useReviews";
import { useTreatments } from "@/features/treatment/hooks/useTreatments";
import { useTreatmentPlans } from "@/features/treatment/hooks/useTreatmentPlans";
import { useProducts } from "@/features/product/hooks/useProducts";
import { useInvoices } from "@/features/billing/hooks/useInvoices";

// Import các components UI
import SerViceReviewCard from "@/features/review/components/ServiceReviewCard";
import TreatmentReviewCard from "@/features/review/components/TreatmentReviewCard";
import ProductReviewCard from "@/features/review/components/ProductReviewCard";
import { ReviewModal } from "@/features/review/components/ReviewModal";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import { Service } from "@/features/service/types";
import { TreatmentPlan } from "@/features/treatment/types";

const ReviewsPage = () => {
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<
    | { type: "appointment"; data: Appointment }
    | { type: "treatment"; data: TreatmentPackage }
    | { type: "product"; data: Product }
    | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Sử dụng các custom hooks để lấy dữ liệu
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const { data: appointments = [], isLoading: loadingAppts } =
    useAppointments();
  const { data: treatments = [], isLoading: loadingTreatments } =
    useTreatments();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: staff = [], isLoading: loadingStaff } = useStaffs();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();
  const { data: treatmentPlans = [], isLoading: loadingPlans } =
    useTreatmentPlans();
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: invoices = [], isLoading: loadingInvoices } = useInvoices();

  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      closeModal();
    },
    onError: (error) => toast.error(`Gửi đánh giá thất bại: ${error.message}`),
  });

  const handleWriteReview = (
    item: Appointment | TreatmentPackage | Product
  ) => {
    if ("date" in item) {
      // Phân biệt bằng thuộc tính duy nhất 'date' của Appointment
      setSelectedItem({ type: "appointment", data: item as Appointment });
    } else if ("treatmentPlanId" in item) {
      // Phân biệt bằng 'treatmentPlanId' của TreatmentPackage
      setSelectedItem({ type: "treatment", data: item as TreatmentPackage });
    } else {
      // Còn lại là Product
      setSelectedItem({ type: "product", data: item as Product });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleReviewSubmit = (data: ReviewFormValues) => {
    if (!selectedItem || !currentUserProfile) return;

    let reviewData: NewReviewData | null = null;

    if (selectedItem.type === "appointment") {
      const appointment = selectedItem.data;
      if (!appointment.technicianId) return;
      reviewData = {
        appointmentId: appointment.id,
        customerId: currentUserProfile.id,
        technicianId: appointment.technicianId,
        serviceId: appointment.serviceId,
        rating: data.rating,
        comment: data.comment,
        imageUrl: "",
        imageUrls: [],
      };
    } else if (selectedItem.type === "treatment") {
      const pkg = selectedItem.data;
      reviewData = {
        appointmentId: `pkg-${pkg.id}`,
        customerId: currentUserProfile.id,
        technicianId: "N/A", // Đánh giá cho cả liệu trình
        serviceId: pkg.treatmentPlanId, // Lưu ID của plan
        rating: data.rating,
        comment: data.comment,
        imageUrl: "",
        imageUrls: [],
      };
    } else if (selectedItem.type === "product") {
      const product = selectedItem.data;
      reviewData = {
        appointmentId: `prod-${product.id}`, // Dùng ID sản phẩm để định danh
        customerId: currentUserProfile.id,
        technicianId: "N/A",
        serviceId: product.id, // Lưu ID sản phẩm vào serviceId cho tiện
        rating: data.rating,
        comment: data.comment,
      };
    }

    if (reviewData) {
      const finalReviewData = {
        ...reviewData,
        imageUrl: "",
        imageUrls: [],
      };
      createReviewMutation.mutate(finalReviewData);
    }
  };

  const getSelectedItemName = () => {
    if (!selectedItem) return "";
    if (selectedItem.type === "appointment") {
      const service = services.find(
        (s: Service) => s.id === selectedItem.data.serviceId
      );
      return service?.name || "Dịch vụ";
    }
    if (selectedItem.type === "treatment") {
      const plan = treatmentPlans.find(
        (p: TreatmentPlan) => p.id === selectedItem.data.treatmentPlanId
      );
      return plan?.name || "Liệu trình";
    }
    if (selectedItem.type === "product") {
      return selectedItem.data.name || "Sản phẩm";
    }

    return "";
  };

  const isLoading =
    loadingCustomers ||
    loadingAppts ||
    loadingTreatments ||
    loadingServices ||
    loadingStaff ||
    loadingReviews ||
    loadingPlans ||
    loadingProducts ||
    loadingInvoices;

  if (isLoading) return <FullPageLoader text="Đang tải dữ liệu đánh giá..." />;

  const appointmentsToReview = appointments.filter(
    (a) =>
      a.customerId === currentUserProfile?.id &&
      a.status === "completed" &&
      !reviews.some((r) => r.appointmentId === a.id)
  );

  const treatmentsToReview = treatments.filter((pkg) => {
    const plan = treatmentPlans.find((p) => p.id === pkg.treatmentPlanId);
    if (!plan) return false;

    const completedCount = pkg.sessions.filter(
      (s) => s.status === "completed"
    ).length;

    // Logic được giữ nguyên nhưng giờ sẽ có dữ liệu để hoạt động
    const isTreatmentCompleted = completedCount >= plan.totalSessions;
    const hasReviewed = reviews.some(
      (r) => r.appointmentId === `pkg-${pkg.id}`
    );

    return isTreatmentCompleted && !hasReviewed;
  });

  const purchasedProducts = invoices
    .filter(
      (inv) =>
        inv.customerId === currentUserProfile?.id && inv.status === "paid"
    )
    .flatMap((inv) => inv.items)
    .filter((item) => item.type === "product");

  const productsToReview = products.filter(
    (product) =>
      purchasedProducts.some((p) => p.id === product.id) &&
      !reviews.some((r) => r.appointmentId === `prod-${product.id}`)
  );

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Đánh giá của bạn" />

      {/* Dịch vụ lẻ */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Dịch vụ lẻ cần đánh giá</h2>
        {appointmentsToReview.length > 0 ? (
          appointmentsToReview.map((appointment) => (
            <SerViceReviewCard
              key={appointment.id}
              appointment={appointment}
              services={services}
              staff={staff}
              onWriteReview={() => handleWriteReview(appointment)}
            />
          ))
        ) : (
          <p className="text-muted-foreground">
            Bạn không có dịch vụ lẻ nào cần đánh giá.
          </p>
        )}
      </section>

      {/* Liệu trình */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Liệu trình cần đánh giá</h2>
        {treatmentsToReview.length > 0 ? (
          treatmentsToReview.map((pkg) => {
            const plan = treatmentPlans.find(
              (p) => p.id === pkg.treatmentPlanId
            );
            if (!plan) return null;
            return (
              <TreatmentReviewCard
                key={pkg.id}
                treatmentPackage={pkg}
                treatmentPlan={plan}
                onWriteReview={() => handleWriteReview(pkg)}
              />
            );
          })
        ) : (
          <p className="text-muted-foreground">
            Bạn không có liệu trình nào cần đánh giá.
          </p>
        )}
      </section>

      {/* Sản phẩm */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Sản phẩm cần đánh giá</h2>
        {productsToReview.length > 0 ? (
          productsToReview.map((product) => (
            <ProductReviewCard
              key={product.id}
              product={product}
              onWriteReview={() => handleWriteReview(product)}
            />
          ))
        ) : (
          <p className="text-muted-foreground">
            Bạn không có sản phẩm nào cần đánh giá.
          </p>
        )}
      </section>

      {selectedItem && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleReviewSubmit}
          itemName={getSelectedItemName()}
          isSubmitting={createReviewMutation.isPending}
        />
      )}
    </div>
  );
};

export default ReviewsPage;
