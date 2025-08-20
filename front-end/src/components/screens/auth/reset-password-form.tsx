// src/components/screens/auth/reset-password-form.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
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
// import { resetPassword } from "@/actions/auth";

// Schema validation: yêu cầu 2 mật khẩu phải khớp nhau
const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"], // Hiển thị lỗi ở ô confirmPassword
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Lấy email từ URL
  const token = searchParams.get("token"); // Lấy token (mã OTP) từ URL

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null);
    setSuccess(null);

    // Giả lập logic đặt lại mật khẩu
    startTransition(() => {
      console.log(
        "Đặt lại mật khẩu mới:",
        values.password,
        "cho email:",
        email,
        "với token:",
        token
      );
      // Ở đây bạn sẽ gọi Server Action
      // resetPassword({ email, token, newPassword: values.password }).then(...)

      setSuccess(
        "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ."
      );
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    });
  };

  // Kiểm tra nếu không có email hoặc token thì không cho truy cập
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

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            {success && (
              <p className="text-sm font-medium text-emerald-500">{success}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
