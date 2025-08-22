"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockTechnicians } from "@/lib/mock-data";
import { Technician } from "@/types/technician";
import Image from "next/image";
import { useState } from "react";

interface TechnicianStepProps {
  onNextStep: (technicianId?: string) => void;
  onPrevStep: () => void;
}

export default function TechnicianStep({
  onNextStep,
  onPrevStep,
}: TechnicianStepProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Trong thực tế, bạn sẽ gọi API để lấy danh sách KTV phù hợp
  const technicians: Technician[] = mockTechnicians;

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
            className={`cursor-pointer transition-all ${
              selectedTech === tech.id
                ? "border-primary ring-2 ring-primary"
                : ""
            }`}
            onClick={() =>
              setSelectedTech(tech.id === selectedTech ? null : tech.id)
            }
          >
            <CardContent className="p-4 flex items-center gap-4">
              <Image
                src={tech.avatarUrl}
                alt={tech.name}
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{tech.name}</p>
                <p className="text-sm text-muted-foreground">
                  {tech.specialty}
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
