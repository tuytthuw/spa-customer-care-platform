import { Product } from "@/features/product/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import Image from "next/image";

interface ProductReviewCardProps {
  product: Product;
  onWriteReview: () => void;
}

const ProductReviewCard = ({
  product,
  onWriteReview,
}: ProductReviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="col-span-1">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={200}
            height={200}
            className="rounded-lg object-contain"
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <p>
              Giá:{" "}
              <strong>
                {new Intl.NumberFormat("vi-VN").format(product.price)} VNĐ
              </strong>
            </p>
            <p className="text-sm text-muted-foreground">Đã mua tại spa.</p>
          </div>
          <Button onClick={onWriteReview} className="mt-4 md:mt-0">
            Viết đánh giá
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviewCard;
