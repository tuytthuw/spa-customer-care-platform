"use client";

import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/types/product";

interface ProductSearchProps {
  onAddProduct: (product: Product) => void;
}

const ProductSearch = ({ onAddProduct }: ProductSearchProps) => {
  const [query, setQuery] = useState("");

  const filteredProducts = query
    ? mockProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
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
          />
          {filteredProducts.length > 0 && (
            <CommandList className="absolute top-full z-10 w-full bg-card shadow-md rounded-b-md">
              <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
              {filteredProducts.map((product) => (
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
              ))}
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
};

export default ProductSearch;
