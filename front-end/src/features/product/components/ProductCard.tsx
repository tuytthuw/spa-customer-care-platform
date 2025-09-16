import { Product } from "@/features/product/types";
import DisplayCard from "@/components/common/DisplayCard";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <DisplayCard
      href={`/products/${product.id}`}
      imageUrl={product.imageUrl}
      title={product.name}
      description={product.description}
      imageFit="contain"
      footerContent={
        <div className="flex justify-between items-center w-full">
          <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
            {product.stock > 0 ? `Còn hàng: ${product.stock}` : "Hết hàng"}
          </Badge>
          <span className="text-lg font-semibold text-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </span>
        </div>
      }
    />
  );
}
