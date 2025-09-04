"use client";

import { useState } from "react";
import { TreatmentPackage } from "@/features/treatment/types";
import { TreatmentPlan } from "@/features/treatment/types";
import { Staff } from "@/features/staff/types";
import { Service } from "@/features/service/types";
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
  serviceList: Service[];
}

export default function TreatmentCard({
  treatmentPackage,
  planInfo,
  staffList,
  serviceList,
}: TreatmentCardProps) {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const completedSessionsCount = treatmentPackage.sessions.filter(
    (s) => s.status === "completed"
  ).length;
  const totalSteps = planInfo.steps.length;
  const progress =
    totalSteps > 0 ? (completedSessionsCount / totalSteps) * 100 : 0;

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
              Đã hoàn thành {completedSessionsCount} / {totalSteps} buổi
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
            serviceList={serviceList}
            treatmentPackageId={treatmentPackage.id}
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
