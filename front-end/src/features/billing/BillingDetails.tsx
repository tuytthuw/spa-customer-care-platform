"use client";

import { InvoiceItem } from "@/types/invoice";
import { Product } from "@/types/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ProductSearch from "./ProductSearch";
import { Separator } from "@/components/ui/separator";

interface BillingDetailsProps {
  items: InvoiceItem[];
  onAddProduct: (product: Product) => void;
  onRemoveItem: (itemId: string) => void;
}

const BillingDetails = ({
  items,
  onAddProduct,
  onRemoveItem,
}: BillingDetailsProps) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = 0;
  const total = subtotal - discount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Chi tiết hóa đơn</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-center">Số lượng</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.price)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.price * item.quantity)}
                </TableCell>
                <TableCell>
                  {item.type === "product" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Separator className="my-4" />
        <ProductSearch onAddProduct={onAddProduct} />
      </div>

      <div className="md:col-span-1 bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Tổng kết</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Giảm giá:</span>
            <span className="text-destructive">{formatCurrency(discount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Phương thức thanh toán</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">Tiền mặt</Button>
            <Button variant="outline">Thẻ</Button>
            <Button variant="outline" className="col-span-2">
              Chuyển khoản
            </Button>
          </div>
        </div>
        <Button className="w-full mt-6">Xác nhận thanh toán</Button>
      </div>
    </div>
  );
};

export default BillingDetails;
