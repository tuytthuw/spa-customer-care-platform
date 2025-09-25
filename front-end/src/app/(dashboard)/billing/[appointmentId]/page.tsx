"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Printer, X } from "lucide-react";

// Types
import { Invoice, InvoiceItem, PaymentMethod } from "@/features/billing/types";
import { Product } from "@/features/product/types";
import { Service } from "@/features/service/types";
import { TreatmentPlan } from "@/features/treatment/types";
import { FullCustomerProfile } from "@/features/customer/types";
import { PrepaidCard } from "@/features/prepaid-card/types";
import { PaymentStatus } from "@/features/appointment/types";

// API & Hooks
import {
  createInvoice,
  InvoiceCreationData,
} from "@/features/billing/api/invoice.api";
import {
  updateAppointmentStatus,
  updateAppointmentPaymentStatus,
} from "@/features/appointment/api/appointment.api";
import { getPrepaidCardByCustomerId } from "@/features/prepaid-card/api/prepaid-card.api";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useServices } from "@/features/service/hooks/useServices";
import { useProducts } from "@/features/product/hooks/useProducts";
import { useTreatmentPlans } from "@/features/treatment/hooks/useTreatmentPlans";
import { useAppointments } from "@/features/appointment/hooks/useAppointments";
import { usePromotions } from "@/features/promotion/hooks/usePromotions";

// Components
import BillingDetails from "@/features/billing/components/BillingDetails";
import InvoiceReceipt from "@/features/billing/components/InvoiceReceipt";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/features/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/components/ui/alert-dialog";
import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/features/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { Label } from "@/features/shared/components/ui/label";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import { PageHeader } from "@/features/shared/components/common/PageHeader";

export default function BillingPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { appointmentId } = params;

  const POINT_TO_VND_RATE = 1000;

  // --- STATES ---
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<FullCustomerProfile | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(
    null
  );
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(
    null
  );
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [prepaidAmountToUse, setPrepaidAmountToUse] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  // --- DATA FETCHING ---
  const { data: customers = [], isLoading: isLoadingCustomers } =
    useCustomers();
  const { data: services = [], isLoading: isLoadingServices } = useServices();
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: treatmentPlans = [], isLoading: isLoadingPlans } =
    useTreatmentPlans();
  const { data: appointments = [], isLoading: isLoadingAppointments } =
    useAppointments();
  const { data: promotions = [], isLoading: isLoadingPromotions } =
    usePromotions();

  const {
    data: prepaidCards = [],
    isLoading: isLoadingPrepaidCards,
  } = // ✅ FIX: Correct loading state name
    useQuery<PrepaidCard[]>({
      queryKey: ["prepaidCards", selectedCustomer?.id],
      queryFn: () => getPrepaidCardByCustomerId(selectedCustomer!.id),
      enabled: !!selectedCustomer,
    });

  const customerPrepaidCard = prepaidCards[0]; // ✅ FIX: Use the correct variable name

  const isLoading =
    isLoadingCustomers ||
    isLoadingServices ||
    isLoadingProducts ||
    isLoadingPlans ||
    isLoadingAppointments ||
    isLoadingPromotions ||
    isLoadingPrepaidCards; // ✅ FIX: Use correct loading state name

  // --- MEMOIZED VALUES ---
  const activePromotions = useMemo(() => {
    return promotions.filter((promo) => {
      const now = new Date();
      return (
        promo.status === "active" &&
        new Date(promo.startDate) <= now &&
        new Date(promo.endDate) >= now
      );
    });
  }, [promotions]);

  // --- EFFECTS ---
  // Effect for calculating totals
  useEffect(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    let newDiscount = 0;
    const promotion = promotions.find((p) => p.id === selectedPromotionId);
    if (promotion) {
      newDiscount = (subtotal * promotion.discountPercent) / 100;
    }
    const amountAfterDiscount = subtotal - newDiscount;
    const pointsValue = pointsToRedeem * POINT_TO_VND_RATE;
    const finalTotal = Math.max(
      0,
      amountAfterDiscount - pointsValue - prepaidAmountToUse
    );
    setDiscount(newDiscount);
    setTotal(finalTotal);
  }, [
    items,
    selectedPromotionId,
    promotions,
    pointsToRedeem,
    prepaidAmountToUse,
  ]);

  // Effect for initializing from appointment ID
  useEffect(() => {
    if (!isLoading && appointmentId && appointmentId !== "new") {
      const appointment = appointments.find((app) => app.id === appointmentId);
      if (appointment) {
        const customer = customers.find((c) => c.id === appointment.customerId);
        const service = services.find((s) => s.id === appointment.serviceId);
        if (customer) setSelectedCustomer(customer);
        if (service) {
          setItems([
            {
              id: service.id,
              name: service.name,
              quantity: 1,
              price: service.price,
              type: "service",
            },
          ]);
        }
      }
    }
  }, [appointmentId, appointments, customers, services, isLoading]);

  // --- MUTATIONS ---
  const updateAppointmentStatusMutation = useMutation({
    mutationFn: (id: string) => updateAppointmentStatus(id, "completed"),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["appointments"] }),
    onError: (error) => toast.error(`Lỗi cập nhật lịch hẹn: ${error.message}`),
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: (data: { appointmentId: string; status: PaymentStatus }) =>
      updateAppointmentPaymentStatus(data.appointmentId, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Đã cập nhật trạng thái thanh toán của lịch hẹn.");
    },
    onError: (error) =>
      toast.error(`Lỗi cập nhật trạng thái thanh toán: ${error.message}`),
  });

  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: (newInvoice) => {
      toast.success(`Tạo hóa đơn #${newInvoice.id.slice(0, 8)} thành công!`);
      if (typeof appointmentId === "string" && appointmentId !== "new") {
        updateAppointmentStatusMutation.mutate(appointmentId);
        updatePaymentStatusMutation.mutate({ appointmentId, status: "paid" });
      }
      setIsConfirmingPayment(false);
      setCompletedInvoice(newInvoice);
    },
    onError: (error) => {
      toast.error(`Tạo hóa đơn thất bại: ${error.message}`);
      setIsConfirmingPayment(false);
    },
  });

  // --- HANDLERS ---
  const handleAddItem = (
    item: Product | Service | TreatmentPlan,
    type: "product" | "service" | "treatment"
  ) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (i) => i.id === item.id && i.type === type
      );
      if (existingItem) {
        return currentItems.map((i) =>
          i.id === item.id && i.type === type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...currentItems,
        {
          id: item.id,
          name: item.name,
          quantity: 1,
          price: item.price,
          type: type,
        },
      ];
    });
  };

  const handleUpdateQuantity = (
    itemId: string,
    itemType: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId, itemType);
    } else {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId && item.type === itemType
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const handleRemoveItem = (itemId: string, itemType: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.id === itemId && item.type === itemType)
      )
    );
  };

  const handleInitiatePayment = () => {
    if (
      !selectedCustomer ||
      items.length === 0 ||
      (total > 0 && !paymentMethod)
    ) {
      toast.warning(
        "Vui lòng chọn khách hàng, sản phẩm và phương thức thanh toán nếu cần."
      );
      return;
    }
    setIsConfirmingPayment(true);
  };

  const handleApplyPromotion = (promotionId: string) => {
    setSelectedPromotionId(promotionId === "none" ? null : promotionId);
  };

  const handleConfirmAndPay = () => {
    if (!selectedCustomer) return;
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const finalPaymentMethod: PaymentMethod =
      total > 0 ? paymentMethod! : "combined";

    const invoiceData: InvoiceCreationData = {
      appointmentId: Array.isArray(appointmentId)
        ? appointmentId.join("")
        : (appointmentId as string) || "N/A",
      customerId: selectedCustomer.id,
      items,
      subtotal,
      discount,
      total,
      paymentMethod: finalPaymentMethod,
      status: "paid",
      pointsToRedeem,
      prepaidCardId: customerPrepaidCard?.id,
      prepaidAmountToUse,
    };
    createInvoiceMutation.mutate(invoiceData);
  };

  const handlePrint = () => window.print();

  const handleCloseReceipt = () => {
    setCompletedInvoice(null);
    setItems([]);
    setSelectedCustomer(null);
    setPaymentMethod(null);
    router.push("/manage-appointments");
  };

  if (isLoading) {
    return <FullPageLoader text="Đang tải dữ liệu thanh toán..." />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Tạo & Thanh toán Hóa đơn"
        description="Tạo hóa đơn cho dịch vụ, sản phẩm và liệu trình."
      />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Thông tin Hóa đơn</CardTitle>
          <div className="flex items-center gap-4 pt-2">
            <Label htmlFor="customer-select" className="mt-2 shrink-0">
              Khách hàng:
            </Label>
            <Select
              value={selectedCustomer?.id || ""}
              onValueChange={(customerId) => {
                const customer = customers.find((c) => c.id === customerId);
                setSelectedCustomer(customer || null);
              }}
              disabled={!!appointmentId && appointmentId !== "new"}
            >
              <SelectTrigger id="customer-select" className="w-[300px]">
                <SelectValue placeholder="Chọn khách hàng..." />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedCustomer && (
            <CardDescription className="pt-2">
              Tạo hóa đơn cho: {selectedCustomer.name} -{" "}
              {selectedCustomer.phone}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <BillingDetails
            items={items}
            services={services}
            products={products}
            treatmentPlans={treatmentPlans}
            onAddItem={handleAddItem}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            customerSelected={!!selectedCustomer}
            onProcessPayment={handleInitiatePayment}
            selectedPaymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            promotions={activePromotions}
            onApplyPromotion={handleApplyPromotion}
            customer={selectedCustomer}
            prepaidCard={customerPrepaidCard}
            pointsToRedeem={pointsToRedeem}
            onPointsRedeemChange={setPointsToRedeem}
            prepaidAmountToUse={prepaidAmountToUse}
            onPrepaidAmountChange={setPrepaidAmountToUse}
            total={total}
            discount={discount}
          />
        </CardContent>
      </Card>

      <AlertDialog
        open={isConfirmingPayment}
        onOpenChange={setIsConfirmingPayment}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thanh toán?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ tạo một hóa đơn mới và không thể hoàn tác. Bạn có
              chắc chắn muốn tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAndPay}
              disabled={createInvoiceMutation.isPending}
            >
              {createInvoiceMutation.isPending
                ? "Đang xử lý..."
                : "Có, xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!completedInvoice}
        onOpenChange={(isOpen) => !isOpen && handleCloseReceipt()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thanh toán thành công</DialogTitle>
          </DialogHeader>
          <div className="printable-receipt">
            {completedInvoice && selectedCustomer && (
              <InvoiceReceipt
                invoice={completedInvoice}
                customer={selectedCustomer}
              />
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={handleCloseReceipt}>
              <X className="mr-2 h-4 w-4" /> Đóng
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
