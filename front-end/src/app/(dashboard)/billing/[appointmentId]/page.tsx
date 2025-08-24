"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { mockAppointments, mockCustomers, mockServices } from "@/lib/mock-data";
import { InvoiceItem } from "@/types/invoice";
import { Product } from "@/types/product";
import BillingDetails from "@/features/billing/BillingDetails";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const BillingPage = () => {
  const params = useParams();
  const { appointmentId } = params;

  const appointment = mockAppointments.find((app) => app.id === appointmentId);
  const customer = mockCustomers.find((c) => c.id.startsWith("cus-"));
  const service = mockServices.find((s) => s.id === appointment?.serviceId);

  const [items, setItems] = useState<InvoiceItem[]>(
    service
      ? [
          {
            id: service.id,
            name: service.name,
            quantity: 1,
            price: service.price,
            type: "service",
          },
        ]
      : []
  );

  const handleAddProduct = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
          type: "product",
        },
      ];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  if (!appointment || !customer || !service) {
    return <div className="p-8">Lịch hẹn không hợp lệ.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Thanh toán hóa đơn</CardTitle>
          <CardDescription>
            Hóa đơn cho: {customer.name} - Dịch vụ: {service.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillingDetails
            items={items}
            onAddProduct={handleAddProduct}
            onRemoveItem={handleRemoveItem}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
