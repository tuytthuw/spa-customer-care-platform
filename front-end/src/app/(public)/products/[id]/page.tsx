// src/app/(public)/products/[id]/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/features/product/api/product.api";
import { getReviews } from "@/features/review/api/review.api";
import { Review } from "@/features/review/types";
import { ReviewList } from "@/features/review/components/ReviewList";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FullPageLoader } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Leaf, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  const [mainImage, setMainImage] = useState<string | null>(null);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  const { data: allReviews = [], isLoading: isLoadingReviews } = useQuery<
    Review[]
  >({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

  useEffect(() => {
    // Luôn ưu tiên hiển thị ảnh chính (imageUrl) khi tải trang
    if (product?.imageUrl) {
      setMainImage(product.imageUrl);
    }
    // Nếu không có ảnh chính, lấy ảnh đầu tiên trong danh sách ảnh phụ
    else if (product?.imageUrls && product.imageUrls.length > 0) {
      setMainImage(product.imageUrls[0]);
    }
  }, [product]);

  if (isLoading || isLoadingReviews) {
    return <FullPageLoader text="Đang tải sản phẩm..." />;
  }

  if (error || !product) {
    notFound();
  }

  const productReviews = allReviews.filter(
    (review) => review.serviceId === product.id
  );

  const thumbnailImages = [
    product.imageUrl,
    ...(product.imageUrls || []),
  ].filter((url): url is string => !!url);

  return (
    <div className="bg-muted/30">
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Cột thư viện ảnh */}
          <div>
            {/* Ảnh chính */}
            <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-lg shadow-lg border bg-white">
              <Image
                src={mainImage || "/images/product-placeholder.png"}
                alt={product.name}
                fill
                className="object-contain p-4 transition-all duration-300"
              />
            </div>
            {/* Dải ảnh phụ (thumbnails) */}
            <div className="flex gap-2">
              {thumbnailImages.map((url, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative w-20 h-20 rounded-md cursor-pointer overflow-hidden ring-2 ring-transparent transition-all hover:ring-primary/50 bg-white border",
                    mainImage === url && "ring-primary"
                  )}
                  onClick={() => setMainImage(url)}
                >
                  <Image
                    src={url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cột thông tin */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <div className="mb-4">
              {product.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="mr-2">
                  {cat}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground mb-6 text-lg">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </span>
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
              </Badge>
            </div>

            <Button size="lg" disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>

            <div className="mt-8 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <ShieldCheck className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />{" "}
                <span>Cam kết chính hãng 100%.</span>
              </div>
              <div className="flex items-center">
                <Leaf className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />{" "}
                <span>Thành phần an toàn, lành tính cho da.</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Phần Tabs thông tin chi tiết */}
        <div className="bg-card p-6 rounded-lg border">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Chi tiết sản phẩm</TabsTrigger>
              <TabsTrigger value="usage">Hướng dẫn sử dụng</TabsTrigger>
              <TabsTrigger value="reviews">
                Đánh giá ({productReviews.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="details"
              className="prose max-w-none text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground"
            >
              <h4>Công dụng chính</h4>
              <ul>
                <li>Cấp ẩm sâu, giúp da căng bóng và mịn màng tức thì.</li>
                <li>
                  Phục hồi hàng rào bảo vệ da, làm dịu da nhạy cảm, kích ứng.
                </li>
                <li>
                  Tăng cường độ đàn hồi, giúp da săn chắc và giảm nếp nhăn.
                </li>
              </ul>
              <h4>Thành phần nổi bật</h4>
              <ul>
                <li>
                  <strong>Hyaluronic Acid (HA):</strong> Dưỡng ẩm vượt trội, giữ
                  nước cho da.
                </li>
                <li>
                  <strong>Vitamin B5 (Panthenol):</strong> Phục hồi và làm dịu
                  da.
                </li>
                <li>
                  <strong>Madecassoside:</strong> Chiết xuất rau má giúp kháng
                  viêm, tái tạo da.
                </li>
              </ul>
            </TabsContent>
            <TabsContent
              value="usage"
              className="prose max-w-none text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground"
            >
              <p>
                Sử dụng hàng ngày vào buổi sáng và tối, sau bước làm sạch và
                toner.
              </p>
              <ol>
                <li>
                  Lấy một lượng serum vừa đủ (khoảng 2-3 giọt) ra lòng bàn tay.
                </li>
                <li>
                  Thoa đều lên mặt và cổ, vỗ nhẹ để serum thẩm thấu hoàn toàn.
                </li>
                <li>
                  Tiếp tục với các bước dưỡng da tiếp theo như kem dưỡng ẩm.
                </li>
              </ol>
              <p>
                <strong>Lưu ý:</strong> Tránh tiếp xúc trực tiếp với mắt. Bảo
                quản nơi khô ráo, thoáng mát.
              </p>
            </TabsContent>
            <TabsContent value="reviews">
              <ReviewList reviews={productReviews} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
