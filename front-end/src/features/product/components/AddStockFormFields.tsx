"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/features/product/types";

interface AddStockFormFieldsProps {
  products: Product[];
}

export default function AddStockFormFields({
  products,
}: AddStockFormFieldsProps) {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="productId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chọn sản phẩm</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sản phẩm để nhập kho..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Tồn kho: {product.stock} {product.baseUnit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="quantityToAdd"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số lượng nhập</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="0"
                {...field}
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || 0)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
