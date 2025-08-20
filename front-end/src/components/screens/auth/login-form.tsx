// src/components/screens/auth/login-form.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react"; // 1. Import thêm useTransition
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { login as loginAction } from "@/actions/auth";

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
  const { login: setAuthUser } = useAuth(); // Đổi tên để rõ ràng hơn
  const [isPending, startTransition] = useTransition(); // 2. Sử dụng useTransition
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // Thêm state cho thông báo thành công

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Hàm xử lý khi submit, sử dụng startTransition
  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      loginAction(values).then((result) => {
        if (result.error) {
          setError(result.error);
        }

        if (result.success && result.user) {
          setSuccess(result.success);
          setAuthUser(result.user); // Cập nhật thông tin user vào context

          // Chuyển hướng đến trang dashboard
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
                      disabled={isPending} // 4. Vô hiệu hóa khi đang chờ
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
                    <Input
                      type="password"
                      {...field}
                      disabled={isPending} // 4. Vô hiệu hóa khi đang chờ
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 5. Hiển thị thông báo Lỗi hoặc Thành công */}
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
          disabled={isPending} // Vô hiệu hóa cả nút Google
        >
          Google
        </Button>
      </CardContent>
    </Card>
  );
}
