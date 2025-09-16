"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/features/product/api/product.api";
import { ReviewList } from "@/features/review/components/ReviewList";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { FullPageLoader } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useReviews } from "@/features/review/hooks/useReviews";
import { PurchaseActions } from "@/components/common/PurchaseActions";
import { DetailPageLayout } from "@/components/common/DetailPageLayout";
import { Tag } from "lucide-react";

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

  const { data: allReviews = [], isLoading: isLoadingReviews } = useReviews();

  useEffect(() => {
    if (product?.imageUrl) {
      setMainImage(product.imageUrl);
    } else if (product?.imageUrls && product.imageUrls.length > 0) {
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
    <DetailPageLayout
      mainImage={mainImage}
      imageAlt={product.name}
      thumbnailUrls={thumbnailImages}
      onThumbnailClick={setMainImage}
      title={<h1 className="text-4xl font-bold mb-4">{product.name}</h1>}
      description={
        <p className="text-muted-foreground">{product.description}</p>
      }
      details={
        <>
          <div className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            <span className="font-semibold">
              {new Intl.NumberFormat("vi-VN").format(product.price)} VNĐ
            </span>
          </div>
          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
            {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
          </Badge>
        </>
      }
      purchaseActions={
        <PurchaseActions
          itemName={product.name}
          buyNowLink={`/auth/login?redirectTo=/checkout?productId=${product.id}`}
          disabled={product.stock === 0}
        />
      }
    >
      <ReviewList reviews={productReviews} />
    </DetailPageLayout>
  );
}
