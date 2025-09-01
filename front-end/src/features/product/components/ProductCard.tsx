// src/features/product/components/ProductCard_Public.tsx

import { Product } from "@/features/product/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group flex">
      <Card className="flex flex-col w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-muted">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105 p-4"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow pt-6 text-center">
          <CardTitle className="text-lg mb-2 h-12 line-clamp-2">
            {product.name}
          </CardTitle>
          <p className="text-xl font-semibold text-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" tabIndex={-1}>
            Xem chi tiết
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
