"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Bolt } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface PurchaseActionsProps {
  itemName: string;
  buyNowLink: string;
  disabled?: boolean;
}

export const PurchaseActions = ({
  itemName,
  buyNowLink,
  disabled = false,
}: PurchaseActionsProps) => {
  const handleAddToCart = () => {
    toast.success(`${itemName} đã được thêm vào giỏ hàng!`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        size="lg"
        variant="outline"
        onClick={handleAddToCart}
        disabled={disabled}
        className="flex-1"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Thêm vào giỏ
      </Button>
      <Button size="lg" asChild disabled={disabled} className="flex-1">
        <Link href={buyNowLink}>
          <Bolt className="mr-2 h-5 w-5" />
          Mua ngay
        </Link>
      </Button>
    </div>
  );
};
