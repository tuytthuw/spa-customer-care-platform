"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StarRating from "@/features/review/components/StarRating";

// **THAY ĐỔI: Cập nhật props để rõ ràng và hiệu quả hơn**
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Hàm để xử lý khi người dùng gửi đánh giá
  onSubmit: (rating: number, comment: string) => void;
  // Chỉ cần truyền tên của dịch vụ/liệu trình
  itemName: string;
  isSubmitting?: boolean;
}

export const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  itemName,
  isSubmitting = false,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Reset state khi modal được mở lại
  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setComment("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (comment.trim() && rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá: {itemName}</DialogTitle>
          <DialogDescription>
            Cảm ơn bạn đã sử dụng dịch vụ. Vui lòng chia sẻ trải nghiệm của bạn.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="mb-2 block">Xếp hạng của bạn</Label>
            {/* Giả sử StarRating nhận onRatingChange */}
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
          <div>
            <Label htmlFor="comment" className="mb-2 block">
              Nhận xét của bạn
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Dịch vụ tuyệt vời, nhân viên chuyên nghiệp..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="images">Thêm hình ảnh (tùy chọn)</Label>
            <Input
              id="images"
              type="file"
              multiple
              // Logic xử lý upload sẽ được thêm sau
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
