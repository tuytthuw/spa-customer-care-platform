// src/components/screens/auth/otp-form.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { otpSchema } from "@/features/auth/schemas";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Lấy email từ URL

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });
  const type = searchParams.get("type");
  const onSubmit = (values: z.infer<typeof otpSchema>) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      // Giả lập OTP đúng là "123456"
      if (values.pin === "123456") {
        setSuccess("Xác thực thành công!");

        // Kiểm tra xem đây là luồng nào
        if (type === "reset") {
          // Luồng ĐẶT LẠI MẬT KHẨU
          setTimeout(() => {
            // Chuyển đến trang reset, mang theo email và mã OTP (coi như token)
            router.push(
              `/auth/reset-password?email=${email}&token=${values.pin}`
            );
          }, 1000);
        } else {
          // Luồng ĐĂNG KÝ (mặc định)
          setTimeout(() => {
            router.push("/auth/login");
          }, 1000);
        }
      } else {
        setError("Mã OTP không chính xác. Vui lòng thử lại.");
      }
    });
  };

  if (!email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lỗi</CardTitle>
          <CardDescription>
            Không tìm thấy địa chỉ email để xác thực. Vui lòng quay lại trang
            đăng ký.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Xác thực tài khoản</CardTitle>
        <CardDescription>
          Chúng tôi đã gửi một mã OTP đến <strong>{email}</strong>. Vui lòng
          nhập mã vào bên dưới.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>Mã OTP</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-sm font-medium text-destructive text-center">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm font-medium text-[var(--status-success)] text-center">
                {success}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang xác thực..." : "Xác thực"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
