// src/features/loyalty/components/LoyaltySettingsForm.tsx
"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoyaltySettings } from "@/features/loyalty/types";
import {
  loyaltySettingsSchema,
  LoyaltySettingsFormValues,
} from "@/features/loyalty/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface LoyaltySettingsFormProps {
  initialData: LoyaltySettings;
}

export default function LoyaltySettingsForm({
  initialData,
}: LoyaltySettingsFormProps) {
  const form = useForm<LoyaltySettingsFormValues>({
    resolver: zodResolver(loyaltySettingsSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tiers",
  });

  const onSubmit = (data: LoyaltySettingsFormValues) => {
    // Logic gọi API để lưu thay đổi sẽ ở đây
    console.log("Dữ liệu đã lưu:", data);
    toast.success("Đã cập nhật cài đặt chương trình khách hàng thân thiết!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ Tích điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="pointsPerVnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền (VNĐ) cho mỗi 1 điểm</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10000"
                      {...field}
                      onChange={(event) =>
                        field.onChange(parseInt(event.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Các Hạng thành viên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg space-y-4 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`tiers.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên hạng</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tiers.${index}.pointGoal`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mốc điểm</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(event) =>
                              field.onChange(parseInt(event.target.value, 10))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tiers.${index}.color`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Màu sắc</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`tiers.${index}.benefits`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Quyền lợi (cách nhau bằng dấu chấm phẩy &quot; ; &quot;)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Quyền lợi 1;Quyền lợi 2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  id: `new-${Date.now()}`,
                  name: "",
                  pointGoal: 0,
                  color: "#000000",
                  benefits: "",
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm hạng thành viên
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Lưu thay đổi</Button>
        </div>
      </form>
    </Form>
  );
}
