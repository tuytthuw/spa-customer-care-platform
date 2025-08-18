"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Eye, EyeOff, Phone, Loader2 } from "lucide-react";

import { useAuth } from "@/providers/auth-context";
import FormCard from "@/components/form/form-card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { LucideIcon } from "lucide-react";

const schema = z
  .object({
    name: z.string().min(2, "Tên quá ngắn"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().optional(),
    password: z.string().min(6, "Tối thiểu 6 ký tự"),
    confirm: z.string(),
    agree: z.boolean().refine((v) => v, "Bạn cần đồng ý điều khoản"),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Mật khẩu không khớp",
  });
type FormValues = z.infer<typeof schema>;

function FieldIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
  );
}

export default function RegisterForm() {
  const { registerClient } = useAuth();
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
      agree: false,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: FormValues) => {
    registerClient({ name: data.name, email: data.email });
    router.push("/client");
  };

  return (
    <FormCard
      title="Tạo tài khoản"
      desc="Khách hàng mới đăng ký để đặt lịch nhanh"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Họ tên */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ tên <span className="text-red-500">*</span>
                </FormLabel>
                <div className="relative">
                  <FieldIcon icon={User} />
                  <FormControl>
                    <Input placeholder="Nguyễn A" className="pl-9" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <div className="relative">
                  <FieldIcon icon={Mail} />
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone (tùy chọn) */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <div className="relative">
                  <FieldIcon icon={Phone} />
                  <FormControl>
                    <Input placeholder="09xx..." className="pl-9" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mật khẩu <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FieldIcon icon={Lock} />
                    <FormControl>
                      <Input
                        type={showPwd ? "text" : "password"}
                        className="pl-9 pr-10"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm */}
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nhập lại mật khẩu <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FieldIcon icon={Lock} />
                    <FormControl>
                      <Input type="password" className="pl-9" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Agree */}
          <FormField
            control={form.control}
            name="agree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Tôi đồng ý với Điều khoản & Chính sách</FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Tạo tài khoản
          </Button>

          <p className="text-xs text-muted-foreground">
            Demo FE-only: chỉ lưu tên & email vào localStorage và chuyển đến khu
            khách hàng.
          </p>
        </form>
      </Form>
    </FormCard>
  );
}
