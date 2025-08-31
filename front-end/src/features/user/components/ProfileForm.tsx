"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PesonFormValues, personSchema } from "@/lib/schemas";
import { toast } from "sonner";

interface ProfileFormProps {
  defaultValues: PesonFormValues;
}

export default function ProfileForm({ defaultValues }: ProfileFormProps) {
  const form = useForm<PesonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues,
  });

  function onSubmit(data: PesonFormValues) {
    // Đây là nơi bạn sẽ gọi API để cập nhật thông tin
    console.log("Dữ liệu cập nhật:", data);
    toast.success("Cập nhật thông tin thành công!");
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>
          Cập nhật thông tin và địa chỉ email của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ tên của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
