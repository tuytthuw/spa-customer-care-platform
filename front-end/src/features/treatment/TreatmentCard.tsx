"use client";

import { useState } from "react";
import { TreatmentPackage } from "@/types/treatment";
import { mockServices } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import SessionHistory from "./SessionHistory";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TreatmentCardProps {
  treatmentPackage: TreatmentPackage;
}

const TreatmentCard = ({ treatmentPackage }: TreatmentCardProps) => {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const service = mockServices.find((s) => s.id === treatmentPackage.serviceId);

  if (!service) {
    return null; // Hoặc hiển thị lỗi
  }

  const progress =
    (treatmentPackage.completedSessions / treatmentPackage.totalSessions) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>
          Đã hoàn thành {treatmentPackage.completedSessions}/
          {treatmentPackage.totalSessions} buổi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full mb-4" />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Ngày mua:{" "}
            {new Date(treatmentPackage.purchaseDate).toLocaleDateString(
              "vi-VN"
            )}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
          >
            Xem chi tiết
            {isHistoryVisible ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
        {isHistoryVisible && (
          <div className="mt-4">
            <SessionHistory sessions={treatmentPackage.sessions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TreatmentCard;
