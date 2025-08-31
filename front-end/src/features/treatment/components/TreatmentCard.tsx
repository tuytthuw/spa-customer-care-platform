"use client";

import { useState } from "react";
import { TreatmentPackage } from "@/features/treatment/types";
import { TreatmentPlan } from "@/features/treatment/types";
import { Staff } from "@/features/staff/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import SessionHistory from "./SessionHistory";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface TreatmentCardProps {
  treatmentPackage: TreatmentPackage;
  planInfo: TreatmentPlan;
  staffList: Staff[];
}

export default function TreatmentCard({
  treatmentPackage,
  planInfo,
  staffList,
}: TreatmentCardProps) {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const progress =
    (treatmentPackage.completedSessions / treatmentPackage.totalSessions) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4">
          <Image
            src={planInfo.imageUrl}
            alt={planInfo.name}
            width={128}
            height={128}
            className="rounded-lg object-cover w-32 h-32"
          />
          <div className="flex-1">
            <CardTitle className="text-xl">{planInfo.name}</CardTitle>
            <CardDescription>
              Đã hoàn thành {treatmentPackage.completedSessions} /{" "}
              {treatmentPackage.totalSessions} buổi
            </CardDescription>
            <Progress value={progress} className="w-full my-3" />
            <p className="text-sm text-muted-foreground">
              Ngày mua:{" "}
              {new Date(treatmentPackage.purchaseDate).toLocaleDateString(
                "vi-VN"
              )}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isHistoryVisible && (
          <SessionHistory
            sessions={treatmentPackage.sessions}
            staffList={staffList}
          />
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsHistoryVisible(!isHistoryVisible)}
          className="w-full"
        >
          {isHistoryVisible ? "Ẩn chi tiết" : "Xem chi tiết liệu trình"}
          {isHistoryVisible ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
