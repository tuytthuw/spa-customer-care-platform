"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { cn } from "@/lib/utils";

// 1. Sửa lại import để dùng mockStaff và type Staff
import { mockStaff } from "@/lib/mock-data";
import { Staff } from "@/features/staff/types";

interface TechnicianStepProps {
  onNextStep: (technicianId?: string) => void;
  onPrevStep: () => void;
}

// 2. Lọc ra danh sách chỉ gồm các kỹ thuật viên từ mockStaff
const technicians: Staff[] = mockStaff.filter(
  (staff) => staff.role === "technician"
);

export default function TechnicianStep({
  onNextStep,
  onPrevStep,
}: TechnicianStepProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const handleSelect = (techId: string) => {
    // Cho phép chọn và bỏ chọn
    if (selectedTech === techId) {
      setSelectedTech(null);
    } else {
      setSelectedTech(techId);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        2. Chọn kỹ thuật viên (tùy chọn)
      </h2>
      <p className="text-muted-foreground mb-6">
        Bạn có thể chọn kỹ thuật viên yêu thích hoặc bỏ qua để hệ thống tự động
        sắp xếp.
      </p>
      <div className="space-y-4">
        {technicians.map((tech) => (
          <Card
            key={tech.id}
            onClick={() => handleSelect(tech.id)}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedTech === tech.id
                ? "border-primary ring-2 ring-primary"
                : ""
            )}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <Image
                // 3. Sửa lại thuộc tính ảnh và thêm ảnh dự phòng
                src={
                  tech.avatar ||
                  `https://api.dicebear.com/7.x/notionists/svg?seed=${tech.id}`
                }
                alt={tech.name}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{tech.name}</p>
                {/* 4. Bỏ thuộc tính "specialty" không tồn tại */}
                <p className="text-sm text-muted-foreground capitalize">
                  {tech.role}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>
          Quay lại
        </Button>
        {/* Cho phép đi tiếp ngay cả khi không chọn KTV */}
        <Button onClick={() => onNextStep(selectedTech || undefined)}>
          Tiếp theo
        </Button>
      </div>
    </div>
  );
}
