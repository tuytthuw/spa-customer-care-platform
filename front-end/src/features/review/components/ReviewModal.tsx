"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Appointment } from "@/features/appointment/types";
import { TreatmentPackage } from "@/features/treatment/types"; // Import TreatmentPackage
import StarRating from "./StarRating";
import { mockServices } from "@/lib/mock-data";

// Cho phép modal nhận appointment hoặc treatmentPackage
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Appointment | TreatmentPackage; // Dùng 'item' chung
}

const ReviewModal = ({ isOpen, onClose, item }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);

  // Xác định serviceId dựa trên loại item
  const serviceId = "serviceId" in item ? item.serviceId : null;
  const service = mockServices.find((s) => s.id === serviceId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    console.log("Submitting review for:", {
      id: item.id,
      rating,
      comment,
      images,
    });
    onClose();
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá: {service.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Đánh giá của bạn</Label>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <div>
            <Label htmlFor="comment">Nhận xét</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn..."
            />
          </div>
          <div>
            <Label htmlFor="images">Thêm hình ảnh</Label>
            <Input
              id="images"
              type="file"
              multiple
              onChange={handleImageChange}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Hủy
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Gửi đánh giá</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
