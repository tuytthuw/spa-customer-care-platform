"use client";

import { useQuery } from "@tanstack/react-query";
import { Resource } from "@/features/resource/types";
import { getResources } from "@/features/resource/api/resource.api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { columns } from "./columns";

export default function ManageResourcesPage() {
  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  if (isLoading) {
    return <div className="p-8">Đang tải danh sách tài nguyên...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Phòng & Thiết bị</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm tài nguyên
        </Button>
      </div>
      <DataTable columns={columns} data={resources} />
    </div>
  );
}
