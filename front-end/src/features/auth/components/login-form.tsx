"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema } from "@/features/auth/schemas";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContexts";
import { login as loginAction } from "@/features/auth/api/auth.api";
import { Button } from "@/features/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(() => {
      login(values).then((user) => {
        if (user) {
          toast.success("Đăng nhập thành công!");
          router.push("/dashboard");
        } else {
          // Lỗi đã được xử lý và thông báo trong API/Context, ở đây có thể thêm logic nếu cần
          toast.error("Email hoặc mật khẩu không chính xác.");
        }
      });
    });
  }

  const handleGoogleLogin = () => {
    // Logic Google login giữ nguyên
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang xử lý..." : "Đăng Nhập"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center w-full">
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
