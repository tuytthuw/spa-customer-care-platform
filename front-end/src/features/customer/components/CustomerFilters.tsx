"use client";

import React from "react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { Search, X } from "lucide-react";

interface CustomerFiltersProps {
  filters: {
    name: string;
    status: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  onResetFilters: () => void;
}

export const CustomerFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
}: CustomerFiltersProps) => {
  return (
    <div className="bg-card p-4 rounded-lg border mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Bọc Input trong div để xử lý icon */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm theo tên, email, SĐT..."
            className="pl-10"
            value={filters.name}
            onChange={(e) => onFilterChange("name", e.target.value)}
          />
        </div>

        {/* Select lọc theo trạng thái */}
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
          </SelectContent>
        </Select>

        {/* Nút reset filter */}
        <Button variant="ghost" onClick={onResetFilters}>
          <X className="mr-2 h-4 w-4" /> Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
};
