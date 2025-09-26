"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/features/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface DashboardDetailPageLayoutProps {
  title: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  backHref?: string; // <-- THÊM PROP MỚI
}

export function DashboardDetailPageLayout({
  title,
  sidebar,
  children,
  backHref, // <-- NHẬN PROP MỚI
}: DashboardDetailPageLayoutProps) {
  const router = useRouter();

  const handleBackClick = () => {
    // Ưu tiên dùng backHref nếu có, nếu không thì dùng router.back()
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
      <div className="w-full lg:w-1/3 lg:sticky lg:top-24 space-y-4">
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        {sidebar}
      </div>
      <div className="w-full lg:w-2/3">
        <h1 className="text-2xl font-bold tracking-tight mb-4">{title}</h1>
        {children}
      </div>
    </div>
  );
}
