"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { Staff } from "@/features/staff/types";
import { useStaffs } from "@/features/staff/hooks/useStaffs"; // SỬA 1: Import hook để lấy dữ liệu thật
import { FullPageLoader } from "@/features/shared/components/ui/spinner"; // SỬA 2: Import component loading

interface TechnicianStepProps {
  onNextStep: (technicianId?: string) => void;
  onPrevStep: () => void;
}

export default function TechnicianStep({
  onNextStep,
  onPrevStep,
}: TechnicianStepProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // SỬA 3: Lấy dữ liệu kỹ thuật viên từ API
  const { data: staff = [], isLoading } = useStaffs();
  const technicians: Staff[] = staff.filter(
    (staffMember) => staffMember.role === "technician"
  );

  const handleSelect = (techId: string) => {
    if (selectedTech === techId) {
      setSelectedTech(null);
    } else {
      setSelectedTech(techId);
    }
  };

  // SỬA 4: Thêm trạng thái loading
  if (isLoading) {
    return <FullPageLoader text="Đang tải danh sách kỹ thuật viên..." />;
  }

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
        <Button onClick={() => onNextStep(selectedTech || undefined)}>
          Tiếp theo
        </Button>
      </div>
    </div>
  );
}
