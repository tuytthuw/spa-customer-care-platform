"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { resetPasswordFormSchema } from "@/features/auth/schemas";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
// 1. Import action thật từ authService và toast
import { resetPassword } from "@/features/auth/api/auth.api";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token"); // Mã OTP từ URL

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Cập nhật hàm onSubmit để gọi API
  const onSubmit = (values: z.infer<typeof resetPasswordFormSchema>) => {
    if (!email || !token) {
      toast.error("Yêu cầu không hợp lệ. Vui lòng thử lại từ đầu.");
      return;
    }

    startTransition(() => {
      resetPassword({
        email,
        token,
        password: values.password,
      }).then((result) => {
        if (result.error) {
          toast.error(result.error);
        }
        if (result.success) {
          toast.success(result.success);
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        }
      });
    });
  };

  if (!email || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu không hợp lệ</CardTitle>
          <CardDescription>
            Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng
            thử lại.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
        <CardDescription>
          Vui lòng nhập mật khẩu mới cho tài khoản <strong>{email}</strong>.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
