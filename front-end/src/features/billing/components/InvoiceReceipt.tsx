"use client";

import { Invoice } from "@/types/invoice";
import { FullCustomerProfile } from "@/features/customer/api/customer.api";
import { Separator } from "@/components/ui/separator";

interface InvoiceReceiptProps {
  invoice: Invoice;
  customer: FullCustomerProfile;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export default function InvoiceReceipt({
  invoice,
  customer,
}: InvoiceReceiptProps) {
  return (
    <div
      className="bg-card text-card-foreground font-sans text-sm p-6 w-full mx-auto tabular-nums"
      /* Không set max-width ở đây để parent (printable-receipt) kiểm soát */
    >
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">SPA TUYẾT THƯ</h1>
        <p className="text-muted-foreground">
          123 Đường ABC, Phường X, Quận Y, TP.HCM
        </p>
        <p className="text-muted-foreground">Hotline: 0987.654.321</p>
      </div>

      <Separator className="my-4" />

      <h2 className="text-lg font-bold text-center mb-4">HÓA ĐƠN THANH TOÁN</h2>

      <div className="flex justify-between mb-2 text-sm">
        <span>Số HĐ: {invoice.id}</span>
        <span>
          Ngày: {new Date(invoice.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </div>
      <div className="mb-4 text-sm">
        <p>Khách hàng: {customer.name}</p>
        <p>Điện thoại: {customer.phone}</p>
      </div>

      <Separator className="my-4" />

      <table className="w-full border-collapse">
        <thead className="text-muted-foreground">
          <tr className="border-b border-border">
            <th className="text-left font-semibold py-2 pr-2">
              Dịch vụ/Sản phẩm
            </th>
            <th className="text-center font-semibold py-2 px-2 whitespace-nowrap w-12">
              SL
            </th>
            <th className="text-right font-semibold py-2 px-2 whitespace-nowrap">
              Đơn giá
            </th>
            <th className="text-right font-semibold py-2 pl-2 whitespace-nowrap">
              Thành tiền
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0">
              <td className="py-2 pr-2">{item.name}</td>
              <td className="text-center py-2 px-2">{item.quantity}</td>
              <td className="text-right py-2 px-2">
                {formatCurrency(item.price)}
              </td>
              <td className="text-right py-2 pl-2">
                {formatCurrency(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Separator className="my-4" />

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tạm tính:</span>
          <span>{formatCurrency(invoice.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Giảm giá:</span>
          <span>{formatCurrency(invoice.discount)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base">
          <span>Tổng cộng:</span>
          <span>{formatCurrency(invoice.total)}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="text-sm">
        <p>
          Phương thức thanh toán:{" "}
          <span className="font-medium capitalize">
            {invoice.paymentMethod}
          </span>
        </p>
      </div>

      <div className="text-center mt-8">
        <p className="font-semibold">Cảm ơn quý khách và hẹn gặp lại!</p>
      </div>
    </div>
  );
}
