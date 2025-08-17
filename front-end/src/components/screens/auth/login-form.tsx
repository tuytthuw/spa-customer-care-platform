"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
} from "@/components/ui/card";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  password: z.string().min(1, {
    message: "Vui lòng nhập mật khẩu.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      // Gọi đến API đăng nhập của backend
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        alert("Email hoặc mật khẩu không chính xác.");
        return;
      }

      // Nhận và xử lý token từ backend
      const data = await response.json();
      const { token } = data;

      if (token) {
        // Lưu token vào localStorage để sử dụng cho các lần gọi API sau
        localStorage.setItem("authToken", token);

        // Chuyển hướng về trang chủ
        router.push("/");
      } else {
        alert("Đăng nhập thất bại, không nhận được token.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  }

  // TODO: Xử lý logic cho nút Đăng nhập với Google
  const handleGoogleLogin = () => {
    // Logic này sẽ phụ thuộc vào cách backend của bạn xử lý OAuth2
    // Thường là mở một cửa sổ popup đến backend endpoint, ví dụ:
    // window.open(`${backendUrl}/api/auth/google`, '_self');
    alert("Chức năng đăng nhập Google sẽ được kết nối với backend sau.");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>
          Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
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
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <div className="text-right mt-2">
                    <Link href="/forgot-password" className="text-sm underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
        </Form>

        <div className="relative my-4">
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
          className="w-full"
          onClick={handleGoogleLogin}
        >
          Đăng nhập với Google
        </Button>

        <div className="mt-4 text-center text-sm">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="underline">
            Đăng ký
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
