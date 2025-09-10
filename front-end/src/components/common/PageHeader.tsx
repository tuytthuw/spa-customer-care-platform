// src/components/common/PageHeader.tsx

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";

interface PageHeaderProps {
  title: string;
  actionButtonText: string;
  onActionButtonClick: () => void;
  // Thêm prop tùy chọn để ẩn nút hành động nếu cần
  hideActionButton?: boolean;
}

export const PageHeader = ({
  title,
  actionButtonText,
  onActionButtonClick,
  hideActionButton = false,
}: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {!hideActionButton && (
        <Button onClick={onActionButtonClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> {actionButtonText}
        </Button>
      )}
    </div>
  );
};
