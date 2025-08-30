"use client";

import { InvoiceItem } from "@/types/invoice";
import { Product } from "@/types/product";
import { Service } from "@/types/service";
import { TreatmentPlan } from "@/types/treatmentPlan";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type PaymentMethod = "cash" | "card" | "transfer";

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
}: BillingDetailsProps) => {
  const [open, setOpen] = React.useState(false);

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
              <TableHead className="text-center w-[150px]">Số lượng</TableHead>
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
          <ToggleGroup
            type="single"
            variant="outline"
            className="w-full grid grid-cols-3"
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
