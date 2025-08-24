"use client";

import { mockCustomers, mockStaff } from "@/lib/mock-data";
import { columns as customerColumns } from "../customers/columns";
import { columns as staffColumns } from "../manage-staffs/columns";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const ManageUsersPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
      </div>

      <Tabs defaultValue="customers">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          <TabsTrigger value="staff">Nhân viên</TabsTrigger>
        </TabsList>
        <TabsContent value="customers" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm khách hàng
            </Button>
          </div>
          <DataTable columns={customerColumns} data={mockCustomers} />
        </TabsContent>
        <TabsContent value="staff" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Thêm nhân viên
            </Button>
          </div>
          <DataTable columns={staffColumns} data={mockStaff} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageUsersPage;
