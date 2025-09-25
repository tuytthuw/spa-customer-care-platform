// src/app/(public)/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/contexts/AuthContexts";
import useCartStore from "@/stores/cart-store";
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import {
  createInvoice,
  InvoiceCreationData,
} from "@/features/billing/api/invoice.api";
import { Invoice } from "@/features/billing/types";
import { shippingSchema, ShippingFormValues } from "@/features/billing/schemas";

import { Button } from "@/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Separator } from "@/features/shared/components/ui/separator";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/features/shared/components/ui/toggle-group";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/features/shared/components/ui/scroll-area";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import { Textarea } from "@/features/shared/components/ui/textarea";

type PaymentMethod = "cod" | "transfer";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, clearCart } = useCartStore();
  const { data: customers = [], isLoading: isLoadingCustomers } =
    useCustomers();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );

  const hasShippableItems = items.some((item) => item.type === "product");

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      address: "",
      notes: "",
    },
  });

  const currentUserProfile = customers.find((c) => c.userId === user?.id);

  useEffect(() => {
    if (!isLoadingCustomers) {
      if (!user) {
        toast.error("Vui lòng đăng nhập để tiến hành thanh toán.");
        router.push("/auth/login?redirectTo=/cart");
      } else if (items.length === 0) {
        router.push("/products");
      }
    }
  }, [user, items, isLoadingCustomers, router]);

  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: (newInvoice) => {
      toast.success(`Tạo hóa đơn #${newInvoice.id} thành công!`, {
        description: "Cảm ơn bạn đã mua hàng.",
      });
      clearCart();
      router.push("/invoices");
    },
    onError: (error) => {
      toast.error(`Thanh toán thất bại: ${error.message}`);
    },
  });

  const handleConfirmPayment = (shippingData: ShippingFormValues) => {
    if (!currentUserProfile || items.length === 0 || !paymentMethod) {
      toast.warning(
        "Vui lòng điền đầy đủ thông tin và chọn phương thức thanh toán."
      );
      return;
    }

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const total = subtotal;

    const invoiceData: InvoiceCreationData = {
      appointmentId: "product-purchase",
      customerId: currentUserProfile.id,
      items: items.map((item) => ({ ...item, type: "product" })),
      subtotal,
      discount: 0,
      total,
      paymentMethod,
      status: "paid",
    };

    if (hasShippableItems) {
      invoiceData.shippingAddress = {
        name: currentUserProfile.name,
        phone: currentUserProfile.phone,
        address: shippingData.address,
        city: "TP. Hồ Chí Minh", // Tạm thời
        notes: shippingData.notes,
      };
    }

    createInvoiceMutation.mutate(invoiceData);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (isLoadingCustomers || !currentUserProfile) {
    return <FullPageLoader text="Đang tải thông tin thanh toán..." />;
  }

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/cart">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại giỏ hàng
        </Link>
      </Button>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleConfirmPayment)}
          className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Cột trái: Thông tin */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{currentUserProfile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentUserProfile.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentUserProfile.phone}
                </p>
              </CardContent>
            </Card>
            {hasShippableItems && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin nhận hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ví dụ: Giao hàng trong giờ hành chính"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  className="w-full grid grid-cols-1 sm:grid-cols-2"
                  value={paymentMethod || ""}
                  onValueChange={(value: PaymentMethod) => {
                    if (value) setPaymentMethod(value);
                  }}
                >
                  {hasShippableItems && (
                    <ToggleGroupItem value="cod">
                      Tiền mặt khi nhận hàng
                    </ToggleGroupItem>
                  )}
                  <ToggleGroupItem value="transfer">
                    Chuyển khoản
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
            </Card>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div>
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 pr-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm line-clamp-2">
                              {item.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              SL: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium whitespace-nowrap">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!paymentMethod || createInvoiceMutation.isPending}
                >
                  {createInvoiceMutation.isPending
                    ? "Đang xử lý..."
                    : `Xác nhận thanh toán`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
