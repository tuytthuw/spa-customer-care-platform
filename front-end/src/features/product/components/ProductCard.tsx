// src/features/product/components/ProductCard.tsx

import { Product } from "@/features/product/types";
import DisplayCard from "@/components/common/DisplayCard"; // Import component mới
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <DisplayCard
      href={`/products/${product.id}`}
      imageUrl={product.imageUrl}
      title={product.name}
      imageFit="contain" // Sản phẩm thường đẹp hơn với 'contain'
      footerContent={
        <div className="flex flex-col items-center w-full text-center">
          <p className="text-xl font-semibold text-primary mb-4">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </p>
          <Button className="w-full" tabIndex={-1}>
            Xem chi tiết
          </Button>
        </div>
      }
    />
  );
}
