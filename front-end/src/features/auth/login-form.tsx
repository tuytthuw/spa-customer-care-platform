// src/components/screens/auth/login-form.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
// 1. Import thêm kiểu 'User' từ context
import { useAuth, User as AuthContextUser } from "@/contexts/AuthContexts";
import { login as loginAction } from "@/services/authService";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

const formSchema = z.object({
  email: z.string().email({
    message: "Địa chỉ email không hợp lệ.",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu không được để trống.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      loginAction(values).then((result) => {
        if (result.error) {
          setError(result.error);
          return; // Dừng lại nếu có lỗi
        }

        if (result.success && result.user) {
          // 2. ÁNH XẠ VAI TRÒ TẠI ĐÂY
          const backendUser = result.user;
          let mappedRole: AuthContextUser["role"] = "customer"; // Mặc định là customer

          // Chuyển đổi vai trò từ backend sang vai trò của frontend context
          if (backendUser.role === "CLIENT") {
            mappedRole = "customer";
          } else if (backendUser.role === "ADMIN") {
            mappedRole = "manager";
          }
          // Bạn có thể thêm các trường hợp khác nếu backend có thêm vai trò
          // else if (backendUser.role === 'TECHNICIAN_ROLE_FROM_BACKEND') {
          //   mappedRole = 'technician';
          // }

          // Tạo một đối tượng user mới với vai trò đã được ánh xạ
          const userForContext: AuthContextUser = {
            ...backendUser,
            role: mappedRole,
          };

          setSuccess(result.success);
          // 3. Truyền đối tượng user đã được chỉnh sửa vào context
          setAuthUser(userForContext);

          router.push("/dashboard");
        }
      });
    });
  }

  const handleGoogleLogin = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback/google`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile openid&prompt=consent`;
    window.location.href = googleAuthUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chào mừng trở lại</CardTitle>
        <CardDescription>
          Nhập thông tin để truy cập vào tài khoản của bạn.
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Mật khẩu</FormLabel>
                    <a
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
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
              {isPending ? "Đang xử lý..." : "Đăng Nhập"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Chưa có tài khoản?{" "}
              <a
                className="text-primary hover:underline font-medium"
                href="/auth/register"
              >
                Đăng ký tại đây
              </a>
            </p>
          </CardFooter>
        </form>
      </Form>
      <CardContent className="pt-0">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Hoặc tiếp tục với
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isPending}
        >
          <FcGoogle className="size-5" aria-hidden="true" />
          Google
        </Button>
      </CardContent>
    </Card>
  );
}
