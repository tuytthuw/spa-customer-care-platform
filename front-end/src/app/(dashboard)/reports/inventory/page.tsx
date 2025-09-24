"use client";

import { useState } from "react"; // Import useState
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { useProducts } from "@/features/product/hooks/useProducts";
import { DataTable } from "@/features/shared/components/ui/data-table";
import { columns } from "./columns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input"; // Import Input
import { Package, PackageX, Sigma } from "lucide-react";

const LOW_STOCK_THRESHOLD = 10;

export default function InventoryReportPage() {
  const { data: products = [] } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  // --- Lọc sản phẩm dựa trên thanh tìm kiếm ---
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Tính toán các chỉ số thống kê (sử dụng `products` gốc chưa lọc) ---
  const totalProducts = products.length;
  const lowStockItems = products.filter(
    (p) => p.stock <= LOW_STOCK_THRESHOLD
  ).length;
  const totalInventoryValue = products.reduce((acc, product) => {
    if (
      product.isRetail &&
      product.price > 0 &&
      product.conversionRate &&
      product.conversionRate > 0
    ) {
      const retailStock = product.stock / product.conversionRate;
      return acc + retailStock * product.price;
    }
    return acc;
  }, 0);

  const formattedTotalValue = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(totalInventoryValue);
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Báo cáo Tồn kho"
        description="Theo dõi số lượng và giá trị tồn kho của tất cả sản phẩm."
      />

      {/* --- Thẻ Thống kê --- */}
      <div className="grid gap-4 md:grid-cols-3 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số sản phẩm
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              loại sản phẩm trong kho
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hàng</CardTitle>
            <PackageX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground">
              sản phẩm dưới ngưỡng an toàn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giá trị kho
            </CardTitle>
            <Sigma className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedTotalValue}</div>
            <p className="text-xs text-muted-foreground">
              Giá trị ước tính của hàng bán lẻ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Thanh tìm kiếm --- */}
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* --- Bảng Dữ liệu Tồn kho --- */}
      {/* ✅ ĐÃ SỬA LỖI: Loại bỏ các props không hợp lệ */}
      <DataTable columns={columns} data={filteredProducts} />
    </div>
  );
}
