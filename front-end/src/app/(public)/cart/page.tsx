// src/app/(public)/cart/page.tsx
"use client";

import useCartStore from "@/stores/cart-store";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/shared/components/ui/table";
import { Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/features/shared/components/ui/separator";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal; // Tạm thời chưa có logic giảm giá

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="container mx-auto py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-6 text-xl font-semibold">Giỏ hàng trống</h2>
          <p className="mt-2 text-muted-foreground">
            Hãy khám phá và thêm sản phẩm bạn yêu thích vào đây nhé.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Bắt đầu mua sắm</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
          <div className="flex-grow">
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Sản phẩm</TableHead>
                    <TableHead>Chi tiết</TableHead>
                    <TableHead className="text-center">Số lượng</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="w-16 mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="w-full lg:w-80 lg:sticky lg:top-24">
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Tổng kết đơn hàng</h2>
              <div className="flex justify-between mb-2 text-muted-foreground">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button asChild className="w-full mt-6" size="lg">
                <Link href="/checkout">Tiến hành thanh toán</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
