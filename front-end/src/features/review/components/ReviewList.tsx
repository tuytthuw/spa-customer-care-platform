"use client";

import { useQuery } from "@tanstack/react-query";
import { Review } from "@/features/review/types";
import { FullCustomerProfile } from "@/features/customer/types";
import { getCustomers } from "@/features/customer/api/customer.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "./StarRating";
interface ReviewListProps {
  reviews: Review[];
}

// Component con để hiển thị một đánh giá
const ReviewItem = ({
  review,
  customer,
}: {
  review: Review;
  customer?: FullCustomerProfile;
}) => (
  <div className="flex items-start gap-4 py-4">
    <Avatar>
      <AvatarImage
        src={
          customer?.avatar ||
          `https://api.dicebear.com/7.x/notionists/svg?seed=${customer?.id}`
        }
      />
      <AvatarFallback>{customer?.name?.[0] || "A"}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{customer?.name || "Một khách hàng"}</p>
        <span className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </div>
      <div className="flex items-center my-1">
        <StarRating rating={review.rating} onRatingChange={() => {}} />
      </div>
      <p className="text-sm text-muted-foreground">{review.comment}</p>
    </div>
  </div>
);

export const ReviewList = ({ reviews }: ReviewListProps) => {
  const { data: customers = [], isLoading } = useQuery<FullCustomerProfile[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  if (isLoading) {
    return <div>Đang tải đánh giá...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">
        Đánh giá từ khách hàng ({reviews.length})
      </h3>
      {reviews.length > 0 ? (
        <div className="divide-y">
          {reviews.map((review) => {
            const customer = customers.find((c) => c.id === review.customerId);
            return (
              <ReviewItem key={review.id} review={review} customer={customer} />
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Chưa có đánh giá nào cho dịch vụ này.
        </p>
      )}
    </div>
  );
};
