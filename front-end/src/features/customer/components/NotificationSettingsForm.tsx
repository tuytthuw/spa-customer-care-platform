"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { FullCustomerProfile } from "@/features/customer/types";
import { updateCustomerProfile } from "@/features/customer/api/customer.api";

import { Button } from "@/features/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/features/shared/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Checkbox } from "@/features/shared/components/ui/checkbox";

// ✅ SỬA LỖI: Schema định nghĩa kiểu dữ liệu cho form
const notificationSettingsSchema = z.object({
  allowPromotions: z.boolean(),
  allowReminders: z.boolean(),
});
type NotificationSettingsFormValues = z.infer<
  typeof notificationSettingsSchema
>;

interface NotificationSettingsFormProps {
  customer: FullCustomerProfile;
}

export default function NotificationSettingsForm({
  customer,
}: NotificationSettingsFormProps) {
  const queryClient = useQueryClient();

  // ✅ SỬA LỖI: Khởi tạo useForm với đúng kiểu và giá trị mặc định
  const form = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      allowPromotions: customer.notificationSettings?.allowPromotions ?? false,
      allowReminders: customer.notificationSettings?.allowReminders ?? true, // Mặc định bật nhắc lịch
    },
  });

  const mutation = useMutation({
    mutationFn: (data: {
      customerId: string;
      settings: NotificationSettingsFormValues;
    }) =>
      updateCustomerProfile(data.customerId, {
        notificationSettings: data.settings,
      }),
    onSuccess: () => {
      toast.success("Cập nhật cài đặt thông báo thành công!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      toast.error(`Cập nhật thất bại: ${error.message}`);
    },
  });

  const onSubmit = (data: NotificationSettingsFormValues) => {
    mutation.mutate({ customerId: customer.id, settings: data });
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Cài đặt Thông báo</CardTitle>
        <CardDescription>
          Chọn các loại thông báo bạn muốn nhận từ chúng tôi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="allowPromotions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Email Khuyến mãi
                    </FormLabel>
                    <FormDescription>
                      Nhận thông tin về các chương trình ưu đãi, giảm giá và sự
                      kiện đặc biệt.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Nhắc lịch hẹn</FormLabel>
                    <FormDescription>
                      Nhận thông báo tự động qua Email/SMS để không bỏ lỡ lịch
                      hẹn quan trọng.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang lưu..." : "Lưu Cài đặt"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
