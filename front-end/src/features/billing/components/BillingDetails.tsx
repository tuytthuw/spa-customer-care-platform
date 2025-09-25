"use client";

import { InvoiceItem } from "@/features/billing/types";
import { Product } from "@/features/product/types";
import { Service } from "@/features/service/types";
import { TreatmentPlan } from "@/features/treatment/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/shared/components/ui/table";
import { Button } from "@/features/shared/components/ui/button";
import { PlusCircle, Trash2, Minus, Plus } from "lucide-react";
import { Separator } from "@/features/shared/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/features/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/features/shared/components/ui/toggle-group";
import { Promotion } from "@/features/promotion/types";
import { Label } from "@/features/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { FullCustomerProfile } from "@/features/customer/types";
import { PrepaidCard } from "@/features/prepaid-card/types";
import { Gem, Wallet } from "lucide-react";
import { Input } from "@/features/shared/components/ui/input";
import { PaymentMethod } from "@/features/billing/types";

const POINT_TO_VND_RATE = 1000;

interface BillingDetailsProps {
  items: InvoiceItem[];
  services: Service[];
  products: Product[];
  treatmentPlans: TreatmentPlan[];
  onAddItem: (
    item: Product | Service | TreatmentPlan,
    type: "product" | "service" | "treatment"
  ) => void;
  onUpdateQuantity: (
    itemId: string,
    itemType: string,
    newQuantity: number
  ) => void;
  onRemoveItem: (itemId: string, itemType: string) => void;
  customerSelected: boolean;
  onProcessPayment: () => void;
  selectedPaymentMethod: PaymentMethod | null;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  promotions: Promotion[];
  onApplyPromotion: (promotionId: string) => void;
  customer: FullCustomerProfile | null;
  prepaidCard: PrepaidCard | undefined;
  pointsToRedeem: number;
  onPointsRedeemChange: (points: number) => void;
  prepaidAmountToUse: number;
  onPrepaidAmountChange: (amount: number) => void;
  discount: number;
  total: number;
}

const BillingDetails = ({
  items,
  services,
  products,
  treatmentPlans,
  onAddItem,
  onUpdateQuantity,
  onRemoveItem,
  customerSelected,
  onProcessPayment,
  selectedPaymentMethod,
  onPaymentMethodChange,
  promotions,
  onApplyPromotion,
  customer,
  prepaidCard,
  pointsToRedeem,
  onPointsRedeemChange,
  prepaidAmountToUse,
  onPrepaidAmountChange,
  discount,
  total,
}: BillingDetailsProps) => {
  const [open, setOpen] = React.useState(false);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value, 10) || 0;
    const maxPoints = customer?.loyaltyPoints || 0;
    onPointsRedeemChange(Math.min(points, maxPoints));
  };

  const handlePrepaidAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0;
    const maxAmount = prepaidCard?.balance || 0;
    onPrepaidAmountChange(Math.min(amount, maxAmount));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Chi tiết hóa đơn</h3>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-center w-[150px]">
                  Số lượng
                </TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={`${item.id}-${item.type}`}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              item.type,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-center w-4">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              item.type,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id, item.type)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Chưa có sản phẩm/dịch vụ nào trong hóa đơn.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Separator className="my-4" />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" disabled={!customerSelected}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm vào hóa đơn
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[400px]">
            <Command>
              <CommandInput placeholder="Tìm dịch vụ, sản phẩm..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy.</CommandEmpty>
                <CommandGroup heading="Dịch vụ lẻ">
                  {services.map((s) => (
                    <CommandItem
                      key={s.id}
                      onSelect={() => {
                        onAddItem(s, "service");
                        setOpen(false);
                      }}
                    >
                      {s.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Liệu trình">
                  {treatmentPlans.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => {
                        onAddItem(p, "treatment");
                        setOpen(false);
                      }}
                    >
                      {p.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Sản phẩm bán lẻ">
                  {products.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => {
                        onAddItem(p, "product");
                        setOpen(false);
                      }}
                    >
                      {p.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="md:col-span-1 bg-muted/50 p-4 rounded-lg flex flex-col">
        <div className="flex-grow space-y-2">
          <h3 className="text-lg font-semibold mb-4">Tổng kết</h3>
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="promotion-select">Khuyến mãi</Label>
            <Select onValueChange={(value) => onApplyPromotion(value)}>
              <SelectTrigger id="promotion-select">
                <SelectValue placeholder="Chọn khuyến mãi..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không áp dụng</SelectItem>
                {promotions.map((promo) => (
                  <SelectItem key={promo.id} value={promo.id}>
                    {promo.title} ({promo.discountPercent}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between">
            <span>Giảm giá:</span>
            <span className="text-destructive">{formatCurrency(discount)}</span>
          </div>
          <Separator />
          {/* ✅ HIỂN THỊ VÀ NHẬP ĐIỂM THƯỞNG */}
          {customer && (customer.loyaltyPoints || 0) > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="points" className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-primary" /> Điểm khả dụng
                </Label>
                <span>
                  {customer.loyaltyPoints?.toLocaleString("vi-VN")} điểm
                </span>
              </div>
              <div className="relative">
                <Input
                  id="points"
                  type="number"
                  placeholder="Nhập số điểm muốn dùng"
                  value={pointsToRedeem || ""}
                  onChange={handlePointsChange}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  = {formatCurrency(pointsToRedeem * POINT_TO_VND_RATE)}
                </span>
              </div>
            </div>
          )}
          {/* ✅ HIỂN THỊ VÀ NHẬP SỐ DƯ THẺ TRẢ TRƯỚC */}
          {prepaidCard && prepaidCard.balance > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="prepaid" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" /> Thẻ trả trước
                </Label>
                <span>SD: {formatCurrency(prepaidCard.balance)}</span>
              </div>
              <div className="relative">
                <Input
                  id="prepaid"
                  placeholder="Nhập số tiền muốn dùng"
                  value={prepaidAmountToUse.toLocaleString("vi-VN")}
                  onChange={handlePrepaidAmountChange}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  VND
                </span>
              </div>
            </div>
          )}{" "}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Còn lại phải trả:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        {total > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Phương thức thanh toán</h4>
            <ToggleGroup
              type="single"
              variant="outline"
              className="w-full grid grid-cols-1 sm:grid-cols-3"
              value={selectedPaymentMethod || ""}
              onValueChange={(value) => {
                if (value) onPaymentMethodChange(value as PaymentMethod);
              }}
            >
              <ToggleGroupItem value="cash">Tiền mặt</ToggleGroupItem>
              <ToggleGroupItem value="card">Thẻ</ToggleGroupItem>
              <ToggleGroupItem value="transfer">Chuyển khoản</ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
        <Button
          className="w-full mt-6"
          disabled={items.length === 0 || !selectedPaymentMethod}
          onClick={onProcessPayment}
        >
          Xác nhận thanh toán
        </Button>
      </div>
    </div>
  );
};

export default BillingDetails;
