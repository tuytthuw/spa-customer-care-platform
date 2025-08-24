"use client";

import { mockProducts } from "@/lib/mock-data";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { columns } from "./columns";

const ManageProductsPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm sản phẩm
        </Button>
      </div>
      <DataTable columns={columns} data={mockProducts} />
    </div>
  );
};

export default ManageProductsPage;
