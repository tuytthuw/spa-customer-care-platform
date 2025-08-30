"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTransition } from "react";
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
// 1. Import action mới và toast
import { sendPasswordResetOtp } from "@/services/authService";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Địa chỉ email không hợp lệ.",
  }),
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Cập nhật hàm onSubmit
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      sendPasswordResetOtp(values.email).then((result) => {
        if (result.error) {
          toast.error(result.error);
        }
        if (result.success) {
          toast.success(result.success);
          // Sau khi thông báo, chuyển người dùng đến trang nhập OTP
          setTimeout(() => {
            router.push(`/auth/verify-otp?email=${values.email}&type=reset`);
          }, 2000); // Đợi 2 giây để người dùng đọc thông báo
        }
      });
    });
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email của bạn và chúng tôi sẽ gửi một mã OTP để đặt lại mật khẩu.
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
