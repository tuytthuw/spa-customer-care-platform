// src/components/screens/auth/forgot-password-form.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  CardFooter,
} from "@/components/ui/card";
// Chúng ta sẽ tạo action này ở bước sau
// import { sendPasswordResetOtp } from "@/actions/auth";

const formSchema = z.object({
  email: z.string().email({
    message: "Địa chỉ email không hợp lệ.",
  }),
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null);
    setSuccess(null);

    // Giả lập logic gửi OTP
    startTransition(() => {
      console.log("Yêu cầu reset mật khẩu cho email:", values.email);
      // Ở đây bạn sẽ gọi Server Action
      // sendPasswordResetOtp(values.email).then(...)

      setSuccess("Nếu email tồn tại, một mã OTP đã được gửi đến bạn.");
      setTimeout(() => {
        // Chuyển hướng đến trang OTP, kèm email và một "type" để phân biệt
        router.push(`/auth/verify-otp?email=${values.email}&type=reset`);
      }, 2000);
    });
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>
          Đừng lo lắng. Hãy nhập email của bạn và chúng tôi sẽ gửi một mã OTP để
          đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            {success && (
              <p className="text-sm font-medium text-emerald-500">{success}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang gửi..." : "Gửi mã OTP"}
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Nhớ mật khẩu rồi?{" "}
              <a
                className="text-primary hover:underline font-medium"
                href="/auth/login"
              >
                Đăng nhập
              </a>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
