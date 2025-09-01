// src/app/(public)/products/[id]/page.tsx

import { getProductById } from "@/features/product/api/product.api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = params;
  const product = await getProductById(id);

  // Hiển thị trang 404 nếu không tìm thấy sản phẩm
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Cột hình ảnh */}
        <div className="bg-muted rounded-lg flex items-center justify-center p-8">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Cột thông tin */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary mb-6">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </p>

          {/* Mô tả sản phẩm (nếu có) có thể thêm vào đây */}
          <div className="prose text-muted-foreground mb-8">
            <p>
              Đây là nơi bạn có thể thêm mô tả chi tiết về sản phẩm, công dụng,
              thành phần và hướng dẫn sử dụng để thuyết phục khách hàng mua
              hàng.
            </p>
            <ul>
              <li>Thành phần chính từ thiên nhiên.</li>
              <li>Phù hợp với mọi loại da.</li>
              <li>Được các chuyên gia da liễu khuyên dùng.</li>
            </ul>
          </div>

          <Button size="lg">Thêm vào giỏ hàng</Button>
        </div>
      </div>
    </div>
  );
}
