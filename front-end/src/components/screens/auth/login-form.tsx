"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";



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
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useAuth } from "@/contexts/auth-context"; // 2. Import useAuth hook
import { login as loginAction } from "@/actions/auth";

// 1. Định nghĩa quy tắc validation cho form bằng Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Địa chỉ email không hợp lệ.",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu không được để trống.",
  }),
});

export function LoginForm() {
  const router = useRouter(); // 2. Khởi tạo router
  const { login } = useAuth(); // 2. Lấy hàm login từ context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State để lưu lỗi

  // 2. Thiết lập form với react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Hàm xử lý khi người dùng nhấn nút Đăng nhập
  // 3. Cập nhật hàm onSubmit để gọi action
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(values); // Đổi tên `login` thành `loginAction` để tránh trùng lặp

      if (result.success) {
        // 3. Gọi hàm login của context để lưu thông tin user
        login(result.user);

        // Chuyển hướng đến trang dashboard
        router.push("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }
  // 1. (Thêm mới) Hàm xử lý khi nhấn nút Google
  const handleGoogleLogin = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback/google`;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile openid&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  // 4. Kết nối form với giao diện JSX
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
                    <Input placeholder="email@example.com" {...field} />

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
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 4. Hiển thị thông báo lỗi */}
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}{" "}
            {/* 2. Cập nhật CardFooter */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
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

      {/* PHẦN ĐĂNG NHẬP GOOGLE - ĐÃ ĐƯỢC DI CHUYỂN RA NGOÀI */}
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
        >
          Google
        </Button>

      </CardContent>
    </Card>
  );
}
