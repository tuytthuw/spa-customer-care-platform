"use client";

import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/features/shared/components/ui/command";
import { Product } from "@/features/product/types";
import { useProducts } from "@/features/product/hooks/useProducts"; // SỬA 1: Import hook để lấy dữ liệu thật

interface ProductSearchProps {
  onAddProduct: (product: Product) => void;
}

const ProductSearch = ({ onAddProduct }: ProductSearchProps) => {
  const [query, setQuery] = useState("");
  const { data: products = [], isLoading } = useProducts(); // SỬA 2: Lấy dữ liệu sản phẩm từ hook

  // Lọc các sản phẩm là hàng bán lẻ và dựa trên query
  const filteredProducts = query
    ? products.filter(
        (
          p: Product // SỬA 3: Thêm kiểu dữ liệu cho 'p'
        ) => p.isRetail && p.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Thêm sản phẩm</h4>
      <div className="flex items-center gap-2">
        <Command className="relative">
          <CommandInput
            placeholder="Tìm sản phẩm..."
            value={query}
            onValueChange={setQuery}
            disabled={isLoading} // Vô hiệu hóa input khi đang tải
          />
          {query.length > 0 &&
            !isLoading && ( // Chỉ hiển thị danh sách khi có query và không đang tải
              <CommandList className="absolute top-full z-10 w-full bg-card shadow-md rounded-b-md">
                <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
                {filteredProducts.map(
                  (
                    product: Product // SỬA 4: Thêm kiểu dữ liệu cho 'product'
                  ) => (
                    <CommandItem
                      key={product.id}
                      onSelect={() => {
                        onAddProduct(product);
                        setQuery("");
                      }}
                      className="flex justify-between cursor-pointer"
                    >
                      <span>{product.name}</span>
                      <span className="text-muted-foreground">
                        {new Intl.NumberFormat("vi-VN").format(product.price)} đ
                      </span>
                    </CommandItem>
                  )
                )}
              </CommandList>
            )}
        </Command>
      </div>
    </div>
  );
};

export default ProductSearch;
